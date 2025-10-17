# Documentación Técnica de MyPlanU

## Instalación
1. Instala las dependencias con Bun:
   ```bash
   bun install
   ```
2. Inicia la app en modo desarrollo (nativo con túnel):
   ```bash
   bun run start
   ```
3. Para previsualizar en el navegador, ejecuta:
   ```bash
   bun run start-web
   ```
4. Desde el servidor de Expo puedes abrir simuladores iOS/Android o escanear el código QR con Expo Go/Rork.

## Dependencias principales
- **React Native 0.79 + Expo 53**: Base del runtime móvil multiplataforma y tooling de desarrollo.  
- **Expo Router 5**: Sistema de rutas basado en archivos ubicado en `app/` que permite navegación declarativa.  
- **React Query 5 (`@tanstack/react-query`)**: Gestión de estado asíncrono y caching para datos remotos/locales.  
- **Zustand 5**: Estado global simple para preferencias y sesión.  
- **AsyncStorage (`@react-native-async-storage/async-storage`)**: Persistencia local clave-valor para usuarios, eventos y amistades.  
- **NativeWind**: Utilidades de estilo con clases tailwind-like sobre React Native.  
- **Date-fns**: Manipulación de fechas en pantallas de calendario y eventos.  
- **Expo Notifications / Location / Image Picker**: Acceso a capacidades nativas del dispositivo.

## Arquitectura del proyecto
- **`app/`**: Capas de UI y navegación estructuradas por Expo Router. Subcarpetas `(auth)` y `(tabs)` agrupan pantallas de autenticación y navegación principal; archivos individuales (`crear-evento.tsx`, `compartir-evento.tsx`, etc.) implementan cada screen.  
- **`components/`**: Biblioteca de componentes reutilizables (botones, tarjetas, inputs, headers, pantallas de carga) con estilos consistentes.  
- **`hooks/`**: Hooks personalizados para lógica transversal (autenticación, eventos, amistades, tema visual).  
- **`data/`**: Acceso a datos y repositorios. `database.ts` encapsula la capa de persistencia y caching; `repositories/` define operaciones CRUD específicas por entidad.  
- **`services/`**: Casos de uso y orquestación de dominio (autenticación, ajustes, notificaciones) consumiendo repositorios y APIs de Expo.  
- **`utils/` y `constants/`**: Utilidades (fechas, validaciones, responsive) y definición del sistema de diseño (`theme.ts`, colores, tipografías).  
- **`assets/`**: Recursos estáticos (iconos, imágenes).  
- **`backend/`**: Configuración placeholder para extensiones de API o funciones server-side futuras.

## Base de datos o persistencia
La app usa `AsyncStorage` como almacenamiento local clave-valor. El módulo `data/database.ts` administra lectura/escritura de colecciones (`usuarios`, `eventos`, `amistades`, `solicitudes_evento`) e implementa caches en memoria con TTL para evitar accesos redundantes. Los repositorios en `data/repositories/` exponen operaciones específicas y centralizan la serialización de cada entidad. También existe un `resetearDB()` para limpiar los datos durante desarrollo y `invalidarCaches()` para refrescar la capa en memoria.

## Escalabilidad y mantenimiento
- **Separación por capas** (UI → hooks → services → data) facilita aislar cambios y permite sustituir AsyncStorage por APIs remotas sin modificar pantallas.  
- **Repositorios tipados y hooks de datos** permiten introducir React Query/Zustand para sincronización avanzada o paginación sin reescribir vistas.  
- **Constantes de diseño centralizadas** garantizan consistencia visual y simplifican la incorporación de nuevos componentes.  
- **Organización modular** en `app/` por segmentos (auth, tabs) permite escalar la navegación añadiendo nuevas rutas anidadas.  
- **Buenas prácticas**: uso de TypeScript, caches controlados, componentes puros y separación de responsabilidades para facilitar pruebas y mantenimiento.

## Cambios recientes
- Se modernizó el sistema visual migrando a `constants/theme.ts` con nueva paleta, tipografías y sombras.  
- Se actualizaron componentes clave (`Button`, `Input`, `Card`) y pantallas principales (`onboarding`, `login`, `registro`, `hoy`, `calendario`, `ajustes`, `crear-evento`) para alinearse con el diseño de Figma.  
- Se documentó el rediseño en `DESIGN_IMPLEMENTATION.md` y se creó la guía `constants/THEME_GUIDE.md`.
- No se registran cambios recientes en la arquitectura de datos ni en la lógica de persistencia.
