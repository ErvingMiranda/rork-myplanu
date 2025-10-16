export const COLORES_PRINCIPALES = {
  primario: '#7C4DFF',
  secundario: '#00E5FF',
  acento: '#00E676',
  fondo: '#FFFFFF',
  textoPrimario: '#000000',
  textoSecundario: '#4A4A4A',
  bordeSuave: '#DADADA',
};

export const GRADIENTES = {
  principal: ['#00E5FF', '#7C4DFF'],
  cabecera: ['#00E5FF', '#7C4DFF'],
  boton: ['#7C4DFF', '#9C6BFF'],
};

export const TIPOGRAFIA = {
  tituloPrincipal: {
    fontWeight: '700' as const,
    fontSize: 32,
  },
  tituloGrande: {
    fontWeight: '700' as const,
    fontSize: 28,
  },
  subtitulo: {
    fontWeight: '500' as const,
    fontSize: 20,
  },
  subtituloMedio: {
    fontWeight: '500' as const,
    fontSize: 18,
  },
  textoNormal: {
    fontWeight: '400' as const,
    fontSize: 16,
  },
  textoPequeno: {
    fontWeight: '400' as const,
    fontSize: 14,
  },
  textoMuyPequeno: {
    fontWeight: '400' as const,
    fontSize: 12,
  },
};

export const ESPACIADO = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const SOMBRAS = {
  suave: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  media: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  fuerte: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const BORDES = {
  input: 12,
  boton: 20,
  card: 16,
  pequeno: 8,
  redondo: 999,
};

export const TEMA_COMPLETO = {
  light: {
    primary: '#7C4DFF',
    secondary: '#00E5FF',
    accent: '#00E676',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    card: '#FFFFFF',
    text: '#000000',
    textSecondary: '#4A4A4A',
    border: '#DADADA',
    error: '#EF4444',
    success: '#00E676',
    warning: '#F59E0B',
    shadow: '#000000',
    gradientStart: '#00E5FF',
    gradientEnd: '#7C4DFF',
  },
  dark: {
    primary: '#9C6BFF',
    secondary: '#33ECFF',
    accent: '#33EF8A',
    background: '#121212',
    surface: '#1E1E1E',
    card: '#2A2A2A',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    border: '#404040',
    error: '#F87171',
    success: '#33EF8A',
    warning: '#FBBF24',
    shadow: '#000000',
    gradientStart: '#33ECFF',
    gradientEnd: '#9C6BFF',
  },
};

export const COLORES_EVENTO = [
  { id: 'violet', nombre: 'Violeta', valor: '#7C4DFF', light: '#E8DEFF' },
  { id: 'cyan', nombre: 'Celeste', valor: '#00E5FF', light: '#CCFBFF' },
  { id: 'green', nombre: 'Verde', valor: '#00E676', light: '#CCFFD9' },
  { id: 'pink', nombre: 'Rosa', valor: '#F06292', light: '#FCE4EC' },
  { id: 'orange', nombre: 'Naranja', valor: '#FF9800', light: '#FFE0B2' },
  { id: 'blue', nombre: 'Azul', valor: '#2196F3', light: '#BBDEFB' },
  { id: 'red', nombre: 'Rojo', valor: '#F44336', light: '#FFCDD2' },
  { id: 'teal', nombre: 'Turquesa', valor: '#009688', light: '#B2DFDB' },
];

export const RECORDATORIOS_OPCIONES = [
  { label: 'Sin recordatorio', valor: 0 },
  { label: '5 minutos antes', valor: 5 },
  { label: '15 minutos antes', valor: 15 },
  { label: '30 minutos antes', valor: 30 },
  { label: '1 hora antes', valor: 60 },
  { label: '1 día antes', valor: 1440 },
];

export const DIAS_SEMANA = [
  { id: 0, nombre: 'Domingo', corto: 'Dom' },
  { id: 1, nombre: 'Lunes', corto: 'Lun' },
  { id: 2, nombre: 'Martes', corto: 'Mar' },
  { id: 3, nombre: 'Miércoles', corto: 'Mié' },
  { id: 4, nombre: 'Jueves', corto: 'Jue' },
  { id: 5, nombre: 'Viernes', corto: 'Vie' },
  { id: 6, nombre: 'Sábado', corto: 'Sáb' },
];
