export const COLORES_EVENTO = [
  { id: 'violet', nombre: 'Violeta', valor: '#6200EA', light: '#E1BEE7' },
  { id: 'pink', nombre: 'Rosa', valor: '#FF6B9D', light: '#FCE4EC' },
  { id: 'cyan', nombre: 'Celeste', valor: '#00FFB3', light: '#B2FFF0' },
  { id: 'navy', nombre: 'Azul Oscuro', valor: '#001F3F', light: '#B3D9FF' },
  { id: 'orange', nombre: 'Naranja', valor: '#FF9800', light: '#FFE0B2' },
  { id: 'blue', nombre: 'Azul', valor: '#2196F3', light: '#BBDEFB' },
  { id: 'red', nombre: 'Rojo', valor: '#F44336', light: '#FFCDD2' },
  { id: 'teal', nombre: 'Turquesa', valor: '#009688', light: '#B2DFDB' },
];

export const TEMA = {
  light: {
    primary: '#6200EA',
    secondary: '#FF6B9D',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    card: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#00FFB3',
    warning: '#F59E0B',
    shadow: '#000000',
  },
  dark: {
    primary: '#8E24FF',
    secondary: '#FF8DB8',
    background: '#001F3F',
    surface: '#002952',
    card: '#2A2A2A',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#4B5563',
    error: '#F87171',
    success: '#33FFCC',
    warning: '#FBBF24',
    shadow: '#000000',
  },
};

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
