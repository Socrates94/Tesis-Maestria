# Capa de Presentación (Front-End)

Este directorio contiene la Interfaz de Usuario (UI) institucional. Es una **Single Page Application (SPA)** construida con **React** y empaquetada con **Vite**.

Sirve como el panel de control gráfico desde el cual los operadores o administradores de la institución pueden gestionar alumnos, emitir Credenciales Verificables y solicitar pruebas de conocimiento cero (ZKP) sin necesidad de interactuar con terminales o código (Swagger).

## Árbol del Directorio

```text
codigo/cliente/
├── public/                  # Archivos estáticos públicos (imágenes, iconos, favicon).
│
├── src/                     # Código fuente principal de la aplicación React.
│   ├── components/          # Componentes visuales reutilizables (Botones, Tablas, Modales).
│   ├── pages/               # Vistas de página completas (Dashboard, Emisión, Verificación).
│   ├── services/            # Funciones para consumir la API de nuestro Backend (FastAPI).
│   ├── styles/              # Archivos de diseño en SASS (Aislamiento y modularidad CSS).
│   ├── App.jsx              # Componente raíz que maneja el enrutamiento.
│   └── main.jsx             # Punto de entrada de React al DOM.
│
├── index.html               # Plantilla HTML base donde se monta React.
├── package.json             # Dependencias de Node.js (React, React Router, Vite, Sass).
├── vite.config.js           # Configuración del empaquetador ultrarrápido Vite.
└── Dockerfile.frontend      # Receta para construir la imagen Docker optimizada para producción (Nginx).
```

## Tecnologías Clave

*   **React:** Biblioteca líder para la construcción de interfaces de usuario interactivas basadas en componentes.
*   **Vite:** Herramienta de construcción (build tool) de nueva generación.
*   **SASS:** Preprocesador CSS que permite usar variables, anidación y módulos.
*   **Fetch API / Axios:** (En `src/services/`) Para la comunicación HTTP directa, exclusiva y segura con nuestro backend en FastAPI.

> **Nota Arquitectónica Importante:** 
> El Front-End **nunca** se comunica directamente con la blockchain (Indy) ni con el Agente criptográfico (ACA-Py). Toda acción en el panel de React se traduce en peticiones seguras hacia el Backend (`codigo/backend`), quien orquesta el proceso. Esto asegura el patrón arquitectónico de Controlador-Agente.

## Estado de Integración

Actualmente el Backend expone los endpoints en `http://localhost:8082` (`/credenciales/invitacion`, `/credenciales/emitir`, `/verificacion/solicitar`). El Front-End será el encargado de consumir estos endpoints para brindar una experiencia de usuario fluida donde el operador de la biblioteca vea el código QR en pantalla y reciba una notificación visual cuando la conexión sea exitosa.
