Objetivo
Desarrollar una aplicación móvil en React Native que consuma la API pública de la NASA,
implemente una pantalla de login simulado y muestre la Imagen Astronómica del Día
(APOD).
Requerimientos Funcionales
1. Pantalla de Login (simulado)
● Formulario con campos de correo electrónico y contraseña.
● Validaciones:
○ Correo con formato válido.
○ Contraseña con mínimo 6 caracteres.
○ Mostrar mensajes de error cuando las validaciones fallen.
● Login simulado contra credenciales hardcodeadas:
○ Email: usuario@nasa.com
○ Contraseña: 123456
● Al iniciar sesión correctamente, navegar a la pantalla principal.
● Botón de "Cerrar sesión" que regrese al login.
2. Pantalla Principal — Imagen Astronómica del Día (APOD)
● Consumir el endpoint APOD de la NASA (ver sección "Referencia completa de la
API" más abajo).
● Mostrar:
○ Imagen del día.
○ Título.
○ Fecha.
○ Descripción / explicación.
● Mostrar un estado de carga (loading) mientras se obtiene la información.
● Manejar errores de red mostrando un mensaje al usuario.
3. Navegación
● Implementar navegación usando React Navigation.
● Stack Navigator para el flujo Login → Pantalla principal.
Requerimientos Técnicos
Requisito Detalle
Lenguaje TypeScript (obligatorio)
Framework React Native con Expo o React Native CLI
Navegación React Navigation v6+
HTTP Client Fetch API o Axios
Estado useState / useContext
Estilos StyleSheet de React Native
Referencia Completa de la API — NASA APOD
Obtener tu API Key
1. Ir a https://api.nasa.gov y registrarse.
2. Recibirás una API Key por correo electrónico en segundos.
3. Mientras tanto puedes usar DEMO_KEY (límite: 30 requests/hora, 50 requests/día).
Base URL
https://api.nasa.gov/planetary/apod
Método HTTP
GET
Parámetros de consulta (Query Params)
Parám
etro
Tipo Reque
rido
Descripción
api_ke
y
strin
g
Sí Tu API Key o DEMO_KEY.
date strin
g
No Fecha en formato YYYY-MM-DD. Si no se envía, retorna la
imagen de hoy. Debe ser posterior a 1995-06-16 (primer
APOD publicado).
thumbs boole
an
No Si es true, retorna URL de thumbnail cuando el APOD del
día es un video.
URL de ejemplo
https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY
Con fecha específica:
https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=2024-01-15
Campos de la respuesta JSON
Campo Tipo Descripción
date strin
g
Fecha de la imagen en formato YYYY-MM-DD.
title strin
g
Título de la imagen o video.
explanation strin
g
Texto explicativo sobre la imagen.
url strin
g
URL de la imagen (o video) en resolución estándar.
hdurl strin
g
URL de la imagen en alta resolución. Puede no existir si el
APOD es un video.
media_type strin
g
Tipo de contenido: "image" o "video".
copyright strin
g
Nombre del autor/fotógrafo. Solo presente si la imagen tiene
copyright.
service_vers
ion
strin
g
Versión del servicio (ej: "v1").
thumbnail_ur
l
strin
g
URL del thumbnail del video (solo si thumbs=true y el APOD
es un video).
Ejemplo de respuesta (imagen)
{
"date": "2024-01-15",
"explanation": "Can you find the comet? True, a bright comet...",
"hdurl": "https://apod.nasa.gov/apod/image/2401/CometSky_Ahorha_2500.jpg",
"media_type": "image",
"service_version": "v1",
"title": "Comet Pons-Brooks in Northern Spring",
"url": "https://apod.nasa.gov/apod/image/2401/CometSky_Ahorha_1080.jpg"
}
Ejemplo de respuesta (video)
{
"date": "2023-12-25",
"explanation": "What does the largest moon in the Solar System look
like?...",
"media_type": "video",
"service_version": "v1",
"title": "Jupiter's Moon Ganymede from Juno",
"url": "https://www.youtube.com/embed/JDi4IdtvDVE?rel=0",
"thumbnail_url": "https://img.youtube.com/vi/JDi4IdtvDVE/0.jpg"
}
Interfaz TypeScript sugerida
interface ApodResponse {
date: string;
title: string;
explanation: string;
url: string;
hdurl?: string;
media_type: 'image' | 'video';
copyright?: string;
service_version: string;
thumbnail_url?: string;
}
Ejemplo de consumo con Fetch
const API_KEY = 'TU_API_KEY'; // o 'DEMO_KEY'
const fetchApod = async (date?: string): Promise<ApodResponse> => {
const params = new URLSearchParams({ api_key: API_KEY });
if (date) {
params.append('date', date);
}
const response = await fetch(
`https://api.nasa.gov/planetary/apod?${params.toString()}`
);
if (!response.ok) {
throw new Error(`Error ${response.status}: ${response.statusText}`);
}
return response.json();
};
Códigos de error comunes
Código HTTP Causa
400 Fecha con formato inválido o fuera de rango.
403 API Key inválida o no proporcionada.
429 Límite de requests excedido (rate limit).
500 Error interno del servidor de NASA.
Límites de uso (Rate Limits)
Tipo de Key Límite por hora Límite por día
DEMO_KEY 30 requests 50 requests
API Key personal 1,000 requests Sin límite diario
Criterios de Evaluación
Criterio Pe
so
Descripción
Funcionalida
d
35
%
La app cumple con los requerimientos funcionales descritos.
Código limpio 25
%
Código organizado, legible, con nombres descriptivos y buena
estructura de carpetas.
TypeScript 20
%
Uso correcto de tipos, interfaces y tipado en componentes, props y
respuestas de API.
UI/UX 10
%
Interfaz clara y con buena experiencia de usuario.
Manejo de
errores
10
%
Estados de carga, manejo de errores de red y estados vacíos.
Puntos Bonus (Opcionales — no afectan si no se entregan)
● Selector de fecha para consultar APOD de días anteriores.
● Persistencia de sesión con AsyncStorage.
● README.md con instrucciones claras de instalación y ejecución