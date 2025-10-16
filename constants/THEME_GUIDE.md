# MyPlanU - Guía de Diseño y Tema

Esta guía documenta el sistema de diseño implementado en MyPlanU basado en los diseños de Figma.

## 🎨 Paleta de Colores

### Colores Principales
```typescript
primario: '#7C4DFF'    // Violeta principal - Botones, acciones principales
secundario: '#00E5FF'   // Celeste - Acentos, información
acento: '#00E676'       // Verde - Éxito, confirmaciones
```

### Colores de Interfaz
```typescript
fondo: '#FFFFFF'              // Fondo principal (modo claro)
textoPrimario: '#000000'      // Texto principal
textoSecundario: '#4A4A4A'    // Texto secundario, subtítulos
bordeSuave: '#DADADA'         // Bordes de inputs y cards
```

### Gradientes
```typescript
degradadoPrincipal: linear-gradient(135deg, #00E5FF → #7C4DFF)
// Usado en: Botones principales, headers, elementos destacados
```

## 📝 Tipografía

### Jerarquía de Texto
- **Título Principal**: 700 bold, 32-34px - Usado en pantallas principales
- **Título Grande**: 700 bold, 28px - Usado en secciones importantes
- **Subtítulo**: 500 medium, 18-20px - Usado en descripciones de secciones
- **Texto Normal**: 400 regular, 16px - Texto de contenido estándar
- **Texto Pequeño**: 400 regular, 14px - Metadata, información secundaria
- **Texto Muy Pequeño**: 400 regular, 12px - Notas al pie, versiones

## 🧩 Componentes

### Inputs
- Border radius: 12px
- Border width: 2px
- Border color: Violeta (#7C4DFF)
- Sombra suave aplicada
- Padding vertical: 14px
- Padding horizontal: 16px
- Min height: 52px

### Botones
- **Variante Gradient**: 
  - Border radius: 20px (estilo "pill")
  - Gradiente azul-violeta
  - Texto blanco, peso 700
  - Sombra media
  
- **Variante Primary**:
  - Background: Violeta sólido
  - Border radius: 20px
  - Sombra suave

- **Variante Outline**:
  - Border 2px violeta
  - Background transparente
  - Border radius: 12px

### Cards
- Border radius: 16px
- Padding: 16px
- Sombra suave (0.08 opacity)
- Background: Blanco (modo claro)
- Border izquierdo de 4px con color de categoría para eventos

### FAB (Floating Action Button)
- Tamaño: 64x64px
- Border radius: 999px (totalmente circular)
- Background: Violeta principal
- Sombra fuerte
- Ícono: 28px, color blanco

## 📱 Pantallas

### Onboarding / Splash
- Fondo blanco
- Gradientes de colores vibrantes en slides
- Botón principal: Variante gradient
- Título: 32px, peso 700
- Descripción: 16px, peso 400

### Login / Registro
- Layout centrado con espaciado generoso
- Ícono superior con gradiente circular (100x100px)
- Título: 34px, peso 700
- Subtítulo: 18px, peso 500
- Inputs con borde violeta
- Botón principal: Variante gradient

### Pantalla "Hoy" (Home)
- **Header con gradiente**:
  - Gradiente azul-celeste → violeta
  - Padding top dinámico (safe area)
  - Avatar circular semi-transparente
  - Saludo personalizado
  
- **Tarjeta de Usuario**:
  - Posición: -100px desde top (overlay sobre header)
  - Avatar: 64x64px, fondo violeta
  - Sombra media
  - Información centrada
  
- **Secciones de Eventos**:
  - Título de sección: 20px, peso 700
  - Cards con borde izquierdo colorido (4px)
  - Información organizada jerárquicamente

### Calendario
- Header con navegación mes/año
- Grid de días del mes
- Día seleccionado: Fondo violeta, texto blanco
- Día actual: Border violeta 2px
- Indicador de eventos: Punto pequeño (6px)
- Lista de eventos del día seleccionado

### Ajustes
- Header con gradiente similar a "Hoy"
- Tarjeta de perfil con avatar y datos del usuario
- Cards de opciones con íconos a la izquierda
- Switches con color violeta activo
- Botón de cerrar sesión: Variante outline

## 🎭 Espaciado

Sistema de espaciado consistente:
```typescript
xs: 4px    // Espaciado mínimo
sm: 8px    // Espaciado pequeño
md: 12px   // Espaciado medio-pequeño
lg: 16px   // Espaciado estándar
xl: 20px   // Espaciado grande
xxl: 24px  // Espaciado muy grande
xxxl: 32px // Espaciado extra grande
```

## ✨ Sombras

Tres niveles de sombra:
- **Suave**: Offset 2px, opacity 0.08, radius 8px - Inputs, cards simples
- **Media**: Offset 4px, opacity 0.12, radius 12px - Cards destacadas
- **Fuerte**: Offset 6px, opacity 0.16, radius 16px - FAB, elementos flotantes

## 🌓 Modo Oscuro

El sistema incluye soporte completo para modo oscuro:
- Primario ajustado a tonos más claros (#9C6BFF)
- Fondo: #121212
- Surface: #1E1E1E
- Card: #2A2A2A
- Texto invertido con contraste adecuado
- Bordes más sutiles (#404040)

## 📦 Uso del Tema

```typescript
import { useTema } from '@/hooks/useTema';
import { BORDES, SOMBRAS, ESPACIADO } from '@/constants/theme';

const { colores } = useTema();

// Usar colores dinámicos (respetan modo claro/oscuro)
backgroundColor: colores.primary
color: colores.text

// Usar constantes de diseño
borderRadius: BORDES.card
...SOMBRAS.suave
paddingHorizontal: ESPACIADO.lg
```

## ♿ Accesibilidad

- Contraste mínimo WCAG AA cumplido en todos los textos
- Tamaños de toque mínimo: 44x44px (iOS) / 48x48px (Android)
- Labels accesibles en todos los componentes interactivos
- Soporte para lectores de pantalla
- Respeto por configuraciones del sistema (tema, tamaño de fuente)

## 🎯 Mejores Prácticas

1. **Usar el hook useTema()** para acceder a colores que respetan el tema activo
2. **Importar constantes** de `@/constants/theme` en lugar de valores hardcodeados
3. **Aplicar sombras** usando spread operator: `...SOMBRAS.suave`
4. **Gradientes** se aplican con LinearGradient de expo-linear-gradient
5. **Safe areas** siempre considerar en pantallas sin header
6. **Border radius** usar BORDES.redondo para elementos circulares perfectos

## 📝 Notas de Implementación

- Los colores de eventos usan una paleta de 8 colores complementarios
- Los inputs siempre tienen borde violeta para mantener consistencia de marca
- Los FABs se posicionan a 24px de los bordes
- Las tarjetas de overlay (como la tarjeta de usuario) usan marginTop negativo
- Los headers con gradiente tienen padding bottom generoso (100-140px) para el efecto de tarjeta flotante
