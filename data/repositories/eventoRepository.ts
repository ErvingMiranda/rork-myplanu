import { obtenerEventos, guardarEventos } from '../database';
import type { Evento, EventoCrear } from '@/types';

export class EventoRepository {
  async crear(evento: EventoCrear, userId: string): Promise<Evento> {
    const eventos = await obtenerEventos();
    const id = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const ahora = new Date().toISOString();

    const nuevoEvento: Evento = {
      ...evento,
      id,
      userId,
      createdAt: ahora,
      updatedAt: ahora,
    };

    eventos.push(nuevoEvento);
    await guardarEventos(eventos);

    return nuevoEvento;
  }

  async obtenerPorId(id: string): Promise<Evento | null> {
    const eventos = await obtenerEventos();
    return eventos.find((e: Evento) => e.id === id) || null;
  }

  async obtenerPorUsuario(userId: string): Promise<Evento[]> {
    const eventos = await obtenerEventos();
    return eventos
      .filter((e: Evento) => e.userId === userId)
      .sort((a: Evento, b: Evento) => 
        new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
      );
  }

  async obtenerPorRango(userId: string, inicio: string, fin: string): Promise<Evento[]> {
    const eventos = await obtenerEventos();
    const inicioTime = new Date(inicio).getTime();
    const finTime = new Date(fin).getTime();

    return eventos
      .filter((e: Evento) => {
        if (e.userId !== userId) return false;
        
        const eventoInicio = new Date(e.fechaInicio).getTime();
        const eventoFin = new Date(e.fechaFin).getTime();

        return (
          (eventoInicio >= inicioTime && eventoInicio <= finTime) ||
          (eventoFin >= inicioTime && eventoFin <= finTime) ||
          (eventoInicio <= inicioTime && eventoFin >= finTime) ||
          e.esRecurrente
        );
      })
      .sort((a: Evento, b: Evento) => 
        new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
      );
  }

  async actualizar(id: string, datos: Partial<EventoCrear>): Promise<void> {
    const eventos = await obtenerEventos();
    const index = eventos.findIndex((e: Evento) => e.id === id);
    
    if (index === -1) return;

    eventos[index] = {
      ...eventos[index],
      ...datos,
      updatedAt: new Date().toISOString(),
    };
    await guardarEventos(eventos);
  }

  async eliminar(id: string): Promise<void> {
    const eventos = await obtenerEventos();
    const filtrados = eventos.filter((e: Evento) => e.id !== id);
    await guardarEventos(filtrados);
  }

  async eliminarPorUsuario(userId: string): Promise<void> {
    const eventos = await obtenerEventos();
    const filtrados = eventos.filter((e: Evento) => e.userId !== userId);
    await guardarEventos(filtrados);
  }
}
