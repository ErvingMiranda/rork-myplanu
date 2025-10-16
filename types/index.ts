export interface Usuario {
  id: string;
  email: string;
  pin: string;
  nombre?: string;
  fotoPerfil?: string;
  descripcion?: string;
  createdAt: string;
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
  recordatorios: number[];
  notas?: string;
  userId: string;
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
  recordatorios: number[];
  notas?: string;
}

export interface Ajustes {
  tema: 'light' | 'dark' | 'auto';
  zonaHoraria: string;
  duracionPorDefecto: number;
  vibracionHabilitada: boolean;
  notificacionesHabilitadas: boolean;
}

export type VistaCalendario = 'dia' | 'semana' | 'mes';
