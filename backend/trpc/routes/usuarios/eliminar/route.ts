import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { UsuarioRepository } from '@/data/repositories/usuarioRepository';
import { EventoRepository } from '@/data/repositories/eventoRepository';
import { AmistadRepository } from '@/data/repositories/amistadRepository';
import { SolicitudEventoRepository } from '@/data/repositories/solicitudEventoRepository';
import type { Amistad, SolicitudEvento } from '@/types';

export const eliminarUsuarioProcedure = publicProcedure
  .input(z.object({
    usuarioId: z.string(),
  }))
  .mutation(async ({ input }: { input: { usuarioId: string } }): Promise<{ success: boolean; message: string }> => {
    const usuarioRepo = new UsuarioRepository();
    const eventoRepo = new EventoRepository();
    const amistadRepo = new AmistadRepository();
    const solicitudEventoRepo = new SolicitudEventoRepository();

    const usuario = await usuarioRepo.obtenerPorId(input.usuarioId);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const eventos = await eventoRepo.obtenerPorUsuario(input.usuarioId);
    for (const evento of eventos) {
      await eventoRepo.eliminar(evento.id);
    }

    const amistades = await amistadRepo.obtenerTodas();
    const amistadesDelUsuario = amistades.filter(
      (a: Amistad) => a.usuarioId === input.usuarioId || a.amigoId === input.usuarioId
    );
    for (const amistad of amistadesDelUsuario) {
      await amistadRepo.eliminar(amistad.id);
    }

    const solicitudes = await solicitudEventoRepo.obtenerTodas();
    const solicitudesDelUsuario = solicitudes.filter(
      (s: SolicitudEvento) => s.remitenteId === input.usuarioId || s.destinatarioId === input.usuarioId
    );
    for (const solicitud of solicitudesDelUsuario) {
      await solicitudEventoRepo.eliminar(solicitud.id);
    }

    await usuarioRepo.eliminar(input.usuarioId);

    return { success: true, message: 'Usuario eliminado correctamente' };
  });
