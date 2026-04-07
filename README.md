# NASA SkyAlert

App movil con React Native y Expo que consume la API de NASA APOD (Astronomy Picture of the Day).

## Stack

- React Native 0.81 / Expo SDK 54
- TypeScript
- Expo Router
- AsyncStorage
- Reanimated

## Setup

```bash
npm install
npx expo start
```

Escanear QR con Expo Go o presionar `a` (Android) / `i` (iOS).

## Credenciales

| Campo      | Valor            |
|------------|------------------|
| Email      | usuario@nasa.com |
| Contrasena | 123456           |

## Estructura

```
app/
  _layout.tsx              Root layout, auth guard
  index.tsx                Redirect
  login.tsx                Login con validaciones
  home.tsx                 Pantalla principal (APOD + Perfil)
components/
  TabBar.tsx               Bottom pill tab bar
  DatePicker.tsx           Selector de fecha con flechas + picker nativo
  ImageViewer.tsx          Modal con pinch-to-zoom
  HistoryModal.tsx         Historial de consultas
context/
  AuthContext.tsx           Sesion con AsyncStorage
  PreferencesContext.tsx    Dark mode + idioma
services/
  nasa.ts                  Consumo API APOD
  device.ts                Info de dispositivo y ubicacion
constants/
  theme.ts                 Colores (light/dark), spacing, tipografia
  i18n.ts                  Traducciones ES/EN
types/
  apod.ts                  Interfaces
```

## Features

- Login con validacion y opcion de recordar sesion
- APOD con selector de fecha (flechas + calendario nativo)
- Tap en imagen para ver fullscreen con zoom
- Historial de consultas con JSON simplificado, timestamp, dispositivo y ubicacion
- Tabs: Inicio y Perfil
- Modo oscuro / claro
- Idioma ES / EN
- Soporte para video (thumbnail + enlace externo)
