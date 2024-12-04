# **GT-PodcastParty**

GT-PodcastParty es una **PWA** (Progressive Web App) diseñada para que los usuarios puedan reproducir podcasts de Web Reactiva. El proyecto está desarrollado en una arquitectura modular que separa el cliente y el servidor.

## **Objetivo del Proyecto**
El objetivo principal es crear una aplicación web intuitiva y accesible que permita a los usuarios gestionar y disfrutar de podcasts, con soporte para dispositivos móviles.

## **Características Principales**

- **Compatibilidad Móvil:** Diseño responsive que permite la instalación y uso como aplicación móvil.
- **Controles de Reproducción Básicos:** Pausar, reproducir y desplazarse por los episodios.
- **Favoritos:** Marcar y consultar episodios favoritos.
- **Historial de Reproducción:** Mostrar los últimos episodios escuchados.
- **Reproducción en Pantalla Bloqueada:** Controles disponibles incluso con la pantalla bloqueada.
- **Control de Velocidad de Reproducción:** Ajuste dinámico de la velocidad de reproducción.

## **Contribuidores**
- Kevin Revelo Flores - Frontend
- Sara Monzón Quesada - Frontend
- Francisco Pérez - Backend
- Belén Suárez - Control de Calidad
- Clari y Mari Marenco - Diseño UX/UI

## **Estructura del Proyecto**
      
      GT-PodcastParty/
      ├── client/        # Frontend de la aplicación (React, Vite)
      ├── server/        # Backend de la aplicación (Node.js, Express.js)
      ├── .env           # Variables de entorno
      ├── package.json   # Dependencias del proyecto
      ├── README.md      # Documentación del proyecto
      └── .gitignore     # Archivos y carpetas ignorados por Git

## **Requisitos Previos**

- **Node.js** (v16 o superior)
- **npm** o **yarn** como gestor de paquetes
- **Vite** para el cliente
- **Express.js** para el servidor

## **Instalación**

1. Clona el repositorio:
   ```bash
   git clone https://github.com/usuario/GT-PodcastParty.git
   cd GT-PodcastParty
2. Configura las variables de entorno para client y server .env
3. Instala las dependencias en cada carpeta:
- En la carpeta raíz
   ```bash
   cd client
   npm install

- cd ../server
   ```bash
   npm install

4. Ejecuta el proyecto en modo desarrollo:
- En la carpeta del cliente
   ```bash
   npm run dev

- En la carpeta del servidor
   ```bash
   npm start

### Realizado para Web Reactiva - ¡Gracias!

