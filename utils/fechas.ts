import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatearFecha(fecha: Date | string, formato: string = 'PPP'): string {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
  if (!isValid(fechaObj)) return '';
  
  return format(fechaObj, formato, { locale: es });
}

export function formatearHora(fecha: Date | string): string {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
  if (!isValid(fechaObj)) return '';
  
  return format(fechaObj, 'HH:mm', { locale: es });
}

export function formatearFechaHora(fecha: Date | string): string {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
  if (!isValid(fechaObj)) return '';
  
  return format(fechaObj, "d 'de' MMMM, HH:mm", { locale: es });
}

export function esHoy(fecha: Date | string): boolean {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
  const hoy = new Date();
  
  return (
    fechaObj.getDate() === hoy.getDate() &&
    fechaObj.getMonth() === hoy.getMonth() &&
    fechaObj.getFullYear() === hoy.getFullYear()
  );
}

export function combinarFechaHora(fecha: Date, hora: { horas: number; minutos: number }): Date {
  const nueva = new Date(fecha);
  nueva.setHours(hora.horas, hora.minutos, 0, 0);
  return nueva;
}
