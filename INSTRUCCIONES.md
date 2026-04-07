# Instrucciones para correr el proyecto

## Requisitos previos

Antes de correr la aplicacion se necesita tener instalado lo siguiente:

- **Node.js** (version 18 o superior) — se descarga desde [nodejs.org](https://nodejs.org/)
- **npm** — viene incluido con Node.js, no se instala por separado
- **Expo Go** — la app se instala en el celular desde la App Store o Google Play. Se usa para probar la aplicacion directo en el dispositivo

Opcionalmente, si se quiere correr en un emulador:

- **Android Studio** con un emulador configurado (para Android)
- **Xcode** con simulador (solo en macOS, para iOS)

## Clonar el repositorio

Abrir una terminal y ejecutar:

```bash
git clone https://github.com/Ramosssssssssss/NASA-SkyAlert.git
cd NASA-SkyAlert
```

## Instalar dependencias

Dentro de la carpeta del proyecto, ejecutar:

```bash
npm install
```

Esto descarga todas las librerias que usa el proyecto. Puede tardar unos minutos dependiendo de la conexion.

## Correr la aplicacion

Para iniciar el servidor de desarrollo:

```bash
npx expo start
```

Esto abre la terminal de Expo con un codigo QR. Desde ahi se puede:

- Escanear el QR con la app **Expo Go** en el celular (el celular y la computadora deben estar en la misma red WiFi)
- Presionar `a` para abrir en un emulador de Android (requiere Android Studio)
- Presionar `i` para abrir en el simulador de iOS (requiere Xcode, solo macOS)
- Presionar `w` para abrir en el navegador web

## API de la NASA

La aplicacion usa la API publica de la NASA (APOD — Astronomy Picture of the Day). La API Key ya esta configurada dentro del proyecto en el archivo `services/nasa.ts`. No se necesita configurar nada extra para que funcione.

Si la key deja de funcionar o se quiere usar una propia, se puede obtener una gratis en [api.nasa.gov](https://api.nasa.gov/) y reemplazarla en ese mismo archivo.

## Estructura del proyecto

```
NASA-SkyAlert/
├── app/                  # Pantallas de la aplicacion (rutas)
│   ├── _layout.tsx       # Layout principal y navegacion
│   ├── index.tsx         # Pantalla de inicio / splash
│   ├── login.tsx         # Pantalla de login
│   └── home.tsx          # Pantalla principal con la imagen del dia
├── components/           # Componentes reutilizables
│   ├── DatePicker.tsx    # Selector de fecha
│   ├── HistoryModal.tsx  # Modal del historial de consultas
│   ├── ImageViewer.tsx   # Visor de imagenes con zoom
│   └── TabBar.tsx        # Barra de navegacion inferior
├── constants/            # Configuracion de tema e idioma
├── context/              # Contextos de React (autenticacion, preferencias)
├── services/             # Llamadas a la API de la NASA y datos del dispositivo
├── types/                # Tipos de TypeScript
├── assets/               # Imagenes y recursos estaticos
└── scripts/              # Scripts auxiliares
```

## Notas

- El proyecto usa **Expo SDK 54**, **React Native 0.81** y **TypeScript**
- La navegacion se maneja con **expo-router**
- No se necesita compilar nada nativo para desarrollo, Expo se encarga de eso
- Si hay problemas con las dependencias, borrar la carpeta `node_modules` y el archivo `package-lock.json`, y volver a correr `npm install`
