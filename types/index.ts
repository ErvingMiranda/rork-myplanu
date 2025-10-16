export interface Usuario {
  id: string;
  email: string;
  pin: string;
  nombre?: string;
  fotoPerfil?: string;
  descripcion?: string;
  eventosPublicos: boolean;
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  texto: string;
  completado: boolean;
  createdAt: string;
}

export interface Recordatorio {
  id: string;
  tipo: 'minutos' | 'horas' | 'dias';
  cantidad: number;
  etiqueta: string;
}

export interface Evento {
  id: string;
  titulo: string;
  curso?: string;
  aula?: string;
  docente?: string;
  fechaInicio: string;
  fechaFin: string;
  color: string;
  esRecurrente: boolean;
  diasSemana?: number[];
  fechaFinRecurrencia?: string;
  recordatorios: Recordatorio[];
  notas?: string;
  userId: string;
  esCompartido: boolean;
  usuariosCompartidos?: string[];
  checklist?: ChecklistItem[];
  etiquetas?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EventoCrear {
  titulo: string;
  curso?: string;
  aula?: string;
  docente?: string;
  fechaInicio: string;
  fechaFin: string;
  color: string;
  esRecurrente: boolean;
  diasSemana?: number[];
  fechaFinRecurrencia?: string;
  recordatorios: Recordatorio[];
  notas?: string;
  esCompartido?: boolean;
  usuariosCompartidos?: string[];
  checklist?: ChecklistItem[];
  etiquetas?: string[];
}

export interface Ajustes {
  tema: 'light' | 'dark' | 'auto';
  zonaHoraria: string;
  duracionPorDefecto: number;
  vibracionHabilitada: boolean;
  notificacionesHabilitadas: boolean;
}

export type VistaCalendario = 'dia' | 'semana' | 'mes';

export interface Amistad {
  id: string;
  usuarioId: string;
  amigoId: string;
  estado: 'pendiente' | 'aceptada' | 'rechazada';
  solicitadoPor: string;
  createdAt: string;
  updatedAt: string;
}

export interface SolicitudEvento {
  id: string;
  eventoId: string;
  remitenteId: string;
  destinatarioId: string;
  estado: 'pendiente' | 'aceptada' | 'rechazada';
  createdAt: string;
  updatedAt: string;
}
