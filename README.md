# Arquitectura Descentralizada de Prevención de Fuga de Datos (SSI)

Este repositorio contiene la implementación base para la tesis sobre **Identidad Auto-soberana (SSI) y Pruebas Criptográficas (ZKP)** para la prevención de fuga de datos. La arquitectura está dividida en microservicios, cumpliendo con los estándares internacionales del W3C (DIDs y Credenciales Verificables).

## Estructura del Proyecto

El proyecto está compuesto por cuatro pilares tecnológicos:

### 1. `infraestructura/` (Hyperledger Indy)
Es la capa más profunda, la **blockchain local** (DLT) donde vivirán los DIDs públicos de tu institución y los esquemas de credenciales. 
- Utiliza **von-network** para levantar 4 nodos validadores en contenedores Docker de manera rápida.
- Al correrla, podrás ver un "Ledger Browser" (Explorador web) en el puerto `9000` para auditar qué hay escrito en la blockchain.

### 2. `identidad/` (Aries Cloud Agent - ACA-Py)
Es el "Agente" criptográfico. Actúa como el intermediario (Middleware) que hace todo el trabajo matemático pesado:
- Emite las credenciales verificables (VCs).
- Genera y procesa las llaves criptográficas.
- Solicita y verifica las pruebas de conocimiento cero (ZKP).
- Funciona 100% *off-chain* (fuera de la blockchain).
- Expone una API Administrativa visual (Swagger) en el puerto `8001`.

### 3. `backend/` (FastAPI + Python)
Es el "cerebro" o **Controlador Institucional**. Aquí viven las reglas de negocio de tu universidad o institución.
- Construido en **FastAPI**.
- No maneja criptografía directamente (para no arriesgar los datos), sino que le envía comandos al Agente ACA-Py para que lo haga por él.
- Recibe las respuestas de ACA-Py a través de "Webhooks" (eventos en tiempo real).

### 4. `cliente/` (React SPA)
Es el **Panel Administrativo Visual**.
- Construido con React y Vite.
- Es la interfaz gráfica donde un operador de tu institución (ej. servicios escolares) se conectará para ver un dashboard, presionar el botón "Emitir Credencial" o ver si un estudiante aprobó una Verificación ZKP.
- Se comunica únicamente con el `backend/`.

---

## Cómo empezar (Ruta de Aprendizaje Recomendada)

Si tienes un año para desarrollar este proyecto, lo ideal es no intentar entender todo de golpe. Aquí tienes la ruta recomendada paso a paso:

1. **Docker (La Base):** 
   - Entiende cómo funciona `docker` y `docker compose`. Absolutamente todo este proyecto se ejecuta en contenedores, por lo que dominar cómo prender, apagar y ver los *logs* de un contenedor es tu habilidad número uno.

2. **Hyperledger Indy (La Blockchain):**
   - Entra a `infraestructura/scripts/` y ejecuta `./start_indy_network.sh`.
   - Abre tu navegador en `http://localhost:9000`. Entiende qué es un DID (Decentralized Identifier) y cómo funciona el Ledger Browser.

3. **FastAPI y Python (El Cerebro):**
   - Aprende a crear un "Hola Mundo" en FastAPI.
   - Entiende qué es un endpoint (GET, POST) y qué son los *Routers*.
   - Aprende qué es un Webhook (esencial para que ACA-Py le avise a FastAPI que algo sucedió).

4. **El Agente ACA-Py (La Magia SSI):**
   - Levanta el agente con `infraestructura/scripts/start_acapy.sh`.
   - Entra a `http://localhost:8001` (La API Administrativa). Juega con el panel de Swagger para ver todas las capacidades que tiene (Connections, Credentials, Present Proof).
   
5. **React (La Interfaz):**
   - Déjalo para el final. Una vez que tu backend pueda emitir una credencial exitosamente usando *Postman* o *cURL*, solo tendrás que conectar React mediante peticiones *Axios* (HTTP).
