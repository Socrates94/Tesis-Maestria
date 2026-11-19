/*
 * Firmware IoT para Control de Acceso Físico (Torniquete BUAP)
 * Microcontrolador: ESP32 NodeMCU
 * Comunicación: Wi-Fi + MQTT (Broker Eclipse Mosquitto)
 *
 * Módulos integrados:
 *  - Actuador: Módulo Relevador 5V (GPIO 26)
 *  - Señalización: LED Verde (GPIO 18), LED Rojo (GPIO 19), Buzzer (GPIO 21)
 *  - Sensor de Cruce: Sensor Infrarrojo Digital / Obstáculo (GPIO 27)
 *  - Lector/Tag NFC: Módulo PN532 por I2C (SDA: GPIO 21/22, SCL: GPIO 22/23)
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// =========================================================================
// CONFIGURACIÓN DE RED Y BROKER MQTT
// =========================================================================
const char* WIFI_SSID = "TU_RED_WIFI";
const char* WIFI_PASSWORD = "TU_PASSWORD_WIFI";

// Dirección IP de la computadora donde corre Docker Mosquitto
const char* MQTT_BROKER_IP = "192.168.1.100"; 
const int   MQTT_BROKER_PORT = 1883;

// Topics MQTT (Deben coincidir con los de verificador_borde/backend)
const char* TOPIC_COMMANDS  = "buap/torniquete/comandos";
const char* TOPIC_TELEMETRY = "buap/torniquete/telemetria";

// =========================================================================
// ASIGNACIÓN DE PINES GPIO
// =========================================================================
const int PIN_RELAY       = 26; // Disparo del Relevador (LOW = Activado en relés activos a bajo)
const int PIN_LED_VERDE   = 18; // LED Verde: Acceso Permitido
const int PIN_LED_ROJO    = 19; // LED Rojo: Bloqueado / Espera
const int PIN_BUZZER      = 23; // Buzzer Piezoeléctrico para beep sonoro
const int PIN_SENSOR_PASO = 27; // Sensor Infrarrojo Digital (D0) para detección de cruce

WiFiClient espClient;
PubSubClient mqttClient(espClient);

// Variables de estado
bool torniqueteAbierto = false;
unsigned long tiempoApertura = 0;
const unsigned long TIMEOUT_APERTURA = 5000; // 5 segundos máximo antes de cerrar automáticamente

// =========================================================================
// DECLARACIÓN DE FUNCIONES
// =========================================================================
void setupWiFi();
void reconnectMQTT();
void callbackMQTT(char* topic, byte* message, unsigned int length);
void accionarTorniquete();
void bloquearTorniquete();
void emitirSonidoExito();
void verificarPasoPersona();

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n--- [INICIANDO SISTEMA DE CONTROL DE ACCESO BUAP] ---");

  // Configuración de Pines
  pinMode(PIN_RELAY, OUTPUT);
  pinMode(PIN_LED_VERDE, OUTPUT);
  pinMode(PIN_LED_ROJO, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_SENSOR_PASO, INPUT);

  // Estado inicial de seguridad: Cerrado y LED Rojo encendido
  bloquearTorniquete();

  // Conexiones de red
  setupWiFi();
  mqttClient.setServer(MQTT_BROKER_IP, MQTT_BROKER_PORT);
  mqttClient.setCallback(callbackMQTT);
}

void loop() {
  if (!mqttClient.connected()) {
    reconnectMQTT();
  }
  mqttClient.loop();

  // Si el torniquete está abierto, monitorear sensor infrarrojo o timeout
  if (torniqueteAbierto) {
    verificarPasoPersona();
  }
}

// =========================================================================
// GESTIÓN DE WI-FI
// =========================================================================
void setupWiFi() {
  Serial.printf("[WiFi] Conectando a %s...\n", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n[WiFi] Conectado exitosamente.");
  Serial.print("[WiFi] Dirección IP asignada al ESP32: ");
  Serial.println(WiFi.localIP());
}

// =========================================================================
// GESTIÓN DE MQTT
// =========================================================================
void reconnectMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("[MQTT] Conectando al broker Mosquitto...");
    String clientId = "ESP32_Torniquete_" + String(random(0xffff), HEX);
    
    if (mqttClient.connect(clientId.c_str())) {
      Serial.println(" Conectado!");
      mqttClient.subscribe(TOPIC_COMMANDS);
      Serial.printf("[MQTT] Suscrito a órdenes de apertura en: %s\n", TOPIC_COMMANDS);
    } else {
      Serial.printf(" Falló (código rc=%d). Reintentando en 5 segundos...\n", mqttClient.state());
      delay(5000);
    }
  }
}

// =========================================================================
// RECEPCIÓN DE MENSAJES (COMANDO ZKP DESDE VERIFICADOR FASTAPI)
// =========================================================================
void callbackMQTT(char* topic, byte* message, unsigned int length) {
  String mensajeStr;
  for (int i = 0; i < length; i++) {
    mensajeStr += (char)message[i];
  }
  Serial.printf("\n[MQTT RECIBIDO] Topic: %s -> %s\n", topic, mensajeStr.c_str());

  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, mensajeStr);

  if (error) {
    Serial.println("[-] Error parseando JSON de comando");
    return;
  }

  const char* accion = doc["accion"];
  if (accion && strcmp(accion, "abrir") == 0) {
    Serial.println(">>> [ORDEN RECIBIDA] Verificación ZKP aprobada en backend.");
    accionarTorniquete();
  }
}

// =========================================================================
// ACCIONAMIENTO DEL RELEVADOR Y SEÑALIZACIÓN
// =========================================================================
void accionarTorniquete() {
  torniqueteAbierto = true;
  tiempoApertura = millis();

  // Disparar relevador (Relés estándar activos a nivel LOW)
  digitalWrite(PIN_RELAY, LOW); 

  // Luces: Verde Encendido, Rojo Apagado
  digitalWrite(PIN_LED_VERDE, HIGH);
  digitalWrite(PIN_LED_ROJO, LOW);

  // Beep sonoro de autorización
  emitirSonidoExito();

  Serial.println(">>> [ACTUADOR] 🟢 TORNIQUETE ABIERTO. Esperando paso del estudiante...");
}

void bloquearTorniquete() {
  torniqueteAbierto = false;

  // Desactivar relevador
  digitalWrite(PIN_RELAY, HIGH); 

  // Luces: Rojo Encendido, Verde Apagado
  digitalWrite(PIN_LED_VERDE, LOW);
  digitalWrite(PIN_LED_ROJO, HIGH);

  Serial.println(">>> [ACTUADOR] 🔴 TORNIQUETE CERRADO / BLOQUEADO.");
}

void emitirSonidoExito() {
  digitalWrite(PIN_BUZZER, HIGH);
  delay(150);
  digitalWrite(PIN_BUZZER, LOW);
}

// =========================================================================
// ANTI-TAILGATING: SENSOR DE CRUCE O TIMEOUT DE SEGURIDAD
// =========================================================================
void verificarPasoPersona() {
  // Los sensores infrarrojos digitales FC-51 entregan LOW cuando detectan obstáculo (cruce)
  int estadoSensor = digitalRead(PIN_SENSOR_PASO);

  if (estadoSensor == LOW) {
    Serial.println("[SENSOR CRUCE] ¡Persona cruzó el torniquete!");
    delay(500); // Pequeño debounce para asegurar que pasó completamente
    bloquearTorniquete();

    // Enviar telemetría de cruce exitoso al Verificador
    StaticJsonDocument<128> telemetria;
    telemetria["evento"] = "cruce_exitoso";
    telemetria["timestamp"] = (unsigned long)time(NULL);
    telemetria["status"] = "cerrado";

    char buffer[128];
    serializeJson(telemetria, buffer);
    mqttClient.publish(TOPIC_TELEMETRY, buffer);
    Serial.printf("[TELEMETRÍA] Publicado en %s: %s\n", TOPIC_TELEMETRY, buffer);
  }
  // Timeout de seguridad: Si no cruza en 5 segundos, volver a cerrar
  else if (millis() - tiempoApertura > TIMEOUT_APERTURA) {
    Serial.println("[TIMEOUT] Tiempo límite de apertura alcanzado sin cruce.");
    bloquearTorniquete();
  }
}
