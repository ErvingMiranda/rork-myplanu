export const COLORES_EVENTO = [
  { id: 'indigo', nombre: 'Índigo', valor: '#6366F1', light: '#E0E7FF' },
  { id: 'purple', nombre: 'Púrpura', valor: '#8B5CF6', light: '#EDE9FE' },
  { id: 'pink', nombre: 'Rosa', valor: '#EC4899', light: '#FCE7F3' },
  { id: 'red', nombre: 'Rojo', valor: '#EF4444', light: '#FEE2E2' },
  { id: 'orange', nombre: 'Naranja', valor: '#F97316', light: '#FFEDD5' },
  { id: 'amber', nombre: 'Ámbar', valor: '#F59E0B', light: '#FEF3C7' },
  { id: 'green', nombre: 'Verde', valor: '#10B981', light: '#D1FAE5' },
  { id: 'teal', nombre: 'Turquesa', valor: '#14B8A6', light: '#CCFBF1' },
  { id: 'cyan', nombre: 'Cian', valor: '#06B6D4', light: '#CFFAFE' },
  { id: 'blue', nombre: 'Azul', valor: '#3B82F6', light: '#DBEAFE' },
];

export const TEMA = {
  light: {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    card: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    shadow: '#000000',
  },
  dark: {
    primary: '#818CF8',
    secondary: '#A78BFA',
    background: '#111827',
    surface: '#1F2937',
    card: '#374151',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#4B5563',
    error: '#F87171',
    success: '#34D399',
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
