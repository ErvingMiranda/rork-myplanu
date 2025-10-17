import { obtenerSolicitudesEvento, guardarSolicitudesEvento } from '../database';
import type { SolicitudEvento } from '@/types';

export class SolicitudEventoRepository {
  async crear(
    eventoId: string, 
    remitenteId: string, 
    destinatarioId: string
  ): Promise<SolicitudEvento> {
    const solicitudes = await obtenerSolicitudesEvento();
    const id = `request_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const ahora = new Date().toISOString();

    const nuevaSolicitud: SolicitudEvento = {
      id,
      eventoId,
      remitenteId,
      destinatarioId,
      estado: 'pendiente',
      createdAt: ahora,
      updatedAt: ahora,
    };

    solicitudes.push(nuevaSolicitud);
    await guardarSolicitudesEvento(solicitudes);

    console.log('📤 Solicitud de evento enviada:', id);
    return nuevaSolicitud;
  }

  async obtenerPorDestinatario(destinatarioId: string): Promise<SolicitudEvento[]> {
    const solicitudes = await obtenerSolicitudesEvento();
    return solicitudes.filter((s: SolicitudEvento) => 
      s.destinatarioId === destinatarioId && 
      s.estado === 'pendiente'
    );
  }

  async obtenerPorRemitente(remitenteId: string): Promise<SolicitudEvento[]> {
    const solicitudes = await obtenerSolicitudesEvento();
    return solicitudes.filter((s: SolicitudEvento) => 
      s.remitenteId === remitenteId
    );
  }

  async aceptar(solicitudId: string): Promise<void> {
    const solicitudes = await obtenerSolicitudesEvento();
    const index = solicitudes.findIndex((s: SolicitudEvento) => s.id === solicitudId);
    
    if (index === -1) return;

    solicitudes[index] = {
      ...solicitudes[index],
      estado: 'aceptada',
      updatedAt: new Date().toISOString(),
    };
    await guardarSolicitudesEvento(solicitudes);
    console.log('✅ Solicitud de evento aceptada:', solicitudId);
  }

  async rechazar(solicitudId: string): Promise<void> {
    const solicitudes = await obtenerSolicitudesEvento();
    const index = solicitudes.findIndex((s: SolicitudEvento) => s.id === solicitudId);
    
    if (index === -1) return;

    solicitudes[index] = {
      ...solicitudes[index],
      estado: 'rechazada',
      updatedAt: new Date().toISOString(),
    };
    await guardarSolicitudesEvento(solicitudes);
    console.log('❌ Solicitud de evento rechazada:', solicitudId);
  }

  async eliminar(solicitudId: string): Promise<void> {
    const solicitudes = await obtenerSolicitudesEvento();
    const filtradas = solicitudes.filter((s: SolicitudEvento) => s.id !== solicitudId);
    await guardarSolicitudesEvento(filtradas);
  }

  async obtenerTodas(): Promise<SolicitudEvento[]> {
    return await obtenerSolicitudesEvento();
  }
}
