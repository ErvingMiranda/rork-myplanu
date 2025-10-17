import { obtenerAmistades, guardarAmistades } from '../database';
import type { Amistad } from '@/types';

export class AmistadRepository {
  async crear(usuarioId: string, amigoId: string): Promise<Amistad> {
    const amistades = await obtenerAmistades();
    const id = `friend_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const ahora = new Date().toISOString();

    const nuevaAmistad: Amistad = {
      id,
      usuarioId,
      amigoId,
      estado: 'pendiente',
      solicitadoPor: usuarioId,
      createdAt: ahora,
      updatedAt: ahora,
    };

    amistades.push(nuevaAmistad);
    await guardarAmistades(amistades);

    console.log('🤝 Solicitud de amistad creada:', id);
    return nuevaAmistad;
  }

  async obtenerAmigos(usuarioId: string): Promise<Amistad[]> {
    const amistades = await obtenerAmistades();
    return amistades.filter((a: Amistad) => 
      (a.usuarioId === usuarioId || a.amigoId === usuarioId) && 
      a.estado === 'aceptada'
    );
  }

  async obtenerSolicitudesPendientes(usuarioId: string): Promise<Amistad[]> {
    const amistades = await obtenerAmistades();
    return amistades.filter((a: Amistad) => 
      a.amigoId === usuarioId && 
      a.estado === 'pendiente'
    );
  }

  async obtenerSolicitudesEnviadas(usuarioId: string): Promise<Amistad[]> {
    const amistades = await obtenerAmistades();
    return amistades.filter((a: Amistad) => 
      a.usuarioId === usuarioId && 
      a.estado === 'pendiente'
    );
  }

  async aceptarSolicitud(amistadId: string): Promise<void> {
    const amistades = await obtenerAmistades();
    const index = amistades.findIndex((a: Amistad) => a.id === amistadId);
    
    if (index === -1) return;

    amistades[index] = {
      ...amistades[index],
      estado: 'aceptada',
      updatedAt: new Date().toISOString(),
    };
    await guardarAmistades(amistades);
    console.log('✅ Solicitud de amistad aceptada:', amistadId);
  }

  async rechazarSolicitud(amistadId: string): Promise<void> {
    const amistades = await obtenerAmistades();
    const index = amistades.findIndex((a: Amistad) => a.id === amistadId);
    
    if (index === -1) return;

    amistades[index] = {
      ...amistades[index],
      estado: 'rechazada',
      updatedAt: new Date().toISOString(),
    };
    await guardarAmistades(amistades);
    console.log('❌ Solicitud de amistad rechazada:', amistadId);
  }

  async eliminarAmistad(usuarioId: string, amigoId: string): Promise<void> {
    const amistades = await obtenerAmistades();
    const filtradas = amistades.filter((a: Amistad) => 
      !((a.usuarioId === usuarioId && a.amigoId === amigoId) || 
        (a.usuarioId === amigoId && a.amigoId === usuarioId))
    );
    await guardarAmistades(filtradas);
    console.log('🗑️ Amistad eliminada');
  }

  async sonAmigos(usuarioId: string, amigoId: string): Promise<boolean> {
    const amistades = await obtenerAmistades();
    return amistades.some((a: Amistad) => 
      ((a.usuarioId === usuarioId && a.amigoId === amigoId) || 
       (a.usuarioId === amigoId && a.amigoId === usuarioId)) &&
      a.estado === 'aceptada'
    );
  }
}
