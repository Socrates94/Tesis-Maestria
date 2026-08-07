# Arquitectura Descentralizada de Prevención de Fuga de Datos (SSI)

Este repositorio contiene la implementación base para la tesis sobre **Identidad Auto-soberana (SSI) y Pruebas Criptográficas (ZKP)** para la prevención de fuga de datos. La arquitectura está dividida en microservicios, cumpliendo con los estándares internacionales del W3C (DIDs y Credenciales Verificables).

## Estructura del Proyecto

El proyecto está compuesto por cuatro pilares tecnológicos:

### 1. `infraestructura/` (Hyperledger Indy)
Es la capa más profunda, la **blockchain local** (DLT) donde viven los DIDs públicos de tu institución y los esquemas de credenciales. 
- Utiliza **von-network** para levantar 4 nodos validadores en contenedores Docker.
- Al correrla, puedes ver un "Ledger Browser" (Explorador web) en `http://localhost:9000` para auditar qué hay escrito en la blockchain y registrar semillas/DIDs.

### 2. `identidad/` (Aries Cloud Agent - ACA-Py)
Es el "Agente" criptográfico. Actúa como el intermediario (Middleware) que hace todo el trabajo matemático pesado:
- Emite las credenciales verificables (VCs) y solicita pruebas ZKP.
- Funciona 100% *off-chain* (fuera de la blockchain) interactuando con las Wallets móviles de los usuarios.
- Expone una API Administrativa visual (Swagger) en el puerto `8001`.

### 3. `backend/` (FastAPI + PostgreSQL)
Es el **Controlador Institucional**. Aquí viven las reglas de negocio de tu universidad o institución.
- Construido en **FastAPI**.
- Se comunica de forma segura con ACA-Py enviándole comandos REST.
- Escucha de vuelta a ACA-Py mediante **Webhooks** y guarda el estado (Conexiones, Emisiones, Verificaciones ZKP) en una base de datos PostgreSQL.
- Expone su propio Swagger en `http://localhost:8082/docs`.

### 4. `cliente/` (React SPA - Pendiente)
Es el **Panel Administrativo Visual**.
- Será la interfaz gráfica donde un operador institucional se conectará para ver el dashboard y presionar los botones "Emitir Credencial" o "Verificar".
- Se comunicará únicamente con el `backend/`.

---

## Orden de Ejecución (Cómo Levantar el Proyecto)

Debido a las dependencias de red, los microservicios deben levantarse en un orden específico:

1. **Levantar la Blockchain (Nodos Indy)**
   ```bash
   cd infraestructura/von-network
   ./manage build
   ./manage start
   ```
   *Espera a que los nodos estén activos en `http://localhost:9000`.*

2. **Registrar la Institución en el Ledger**
   Abre una terminal y registra el DID oficial de la institución:
   ```bash
   curl -d '{"role":"ENDORSER","alias":"Institucion","did":"JDmZmbYJnRyz5mb5U9wCxK","seed":"00000000000000000000000000000002","verkey":"APN393PJb55Jyi94DtgkQPd9zxghPbFSPqheppei5Esf"}' -H "Content-Type: application/json" -X POST http://localhost:9000/register
   ```

3. **Levantar el Agente Criptográfico (ACA-Py)**
   ```bash
   cd identidad
   docker compose -f docker-compose.acapy.yml up -d
   ```

4. **Levantar el Backend Institucional (FastAPI + DB)**
   ```bash
   cd backend
   docker compose up --build -d
   ```
   *Accede a `http://localhost:8082/docs` para interactuar con el sistema.*
