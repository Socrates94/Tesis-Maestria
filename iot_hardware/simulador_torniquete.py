import paho.mqtt.client as mqtt
import time
import json

BROKER_ADDRESS = "localhost"
BROKER_PORT = 1883
TOPIC_TURNSTILE_COMMANDS = "buap/torniquete/comandos"
TOPIC_TURNSTILE_TELEMETRY = "buap/torniquete/telemetria"

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("[+] Conectado al Broker MQTT (Mosquitto)")
        client.subscribe(TOPIC_TURNSTILE_COMMANDS)
        print(f"[*] Escuchando órdenes de apertura en: {TOPIC_TURNSTILE_COMMANDS}")
    else:
        print(f"[-] Falla al conectar con código: {rc}")

def on_message(client, userdata, msg):
    payload = msg.payload.decode("utf-8")
    print(f"\n[MENSAJE RECIBIDO] Topic: {msg.topic} -> {payload}")
    
    try:
        comando = json.loads(payload)
        if comando.get("accion") == "abrir":
            print(">>> [SIMULACIÓN HW] Accionando relevador...")
            print(">>> [SIMULACIÓN HW] 🟢 TORNIQUETE ABIERTO")
            time.sleep(2) # Espera simulada a que pase la persona
            print(">>> [SIMULACIÓN HW] 🔴 TORNIQUETE CERRADO (Sensor Infrarrojo cruzado)")
            
            # Enviar confirmación de paso al Verificador (Anti-tailgating)
            telemetria = {
                "evento": "cruce_exitoso",
                "timestamp": int(time.time()),
                "status": "cerrado"
            }
            client.publish(TOPIC_TURNSTILE_TELEMETRY, json.dumps(telemetria))
            print(f"[*] Enviando telemetría: {telemetria}")
    except json.JSONDecodeError:
        print("[-] Error decodificando el comando MQTT (no es JSON válido)")

if __name__ == "__main__":
    print("Iniciando Simulador del Torniquete Físico (IoT)...")
    client = mqtt.Client(client_id="ESP32_Simulador")
    client.on_connect = on_connect
    client.on_message = on_message
    
    try:
        client.connect(BROKER_ADDRESS, BROKER_PORT, 60)
        client.loop_forever()
    except ConnectionRefusedError:
        print("[-] No se pudo conectar a Mosquitto. Asegúrate de que los contenedores estén corriendo.")
    except KeyboardInterrupt:
        print("\n[*] Simulador apagado.")
        client.disconnect()
