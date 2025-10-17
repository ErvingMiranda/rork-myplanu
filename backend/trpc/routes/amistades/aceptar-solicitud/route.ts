import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { db } from "../../../../data/db";

export const aceptarSolicitudProcedure = publicProcedure
  .input(z.object({ amistadId: z.string() }))
  .mutation(({ input }) => {
    console.log('✅ Aceptando solicitud:', input.amistadId);
    
    const amistad = db.amistades.getById(input.amistadId);
    if (!amistad) {
      throw new Error('Solicitud no encontrada');
    }
    
    if (amistad.estado !== 'pendiente') {
      throw new Error('Esta solicitud ya fue procesada');
    }
    
    const actualizada = db.amistades.update(input.amistadId, {
      estado: 'aceptada',
      updatedAt: new Date().toISOString(),
    });
    
    console.log('✅ Solicitud aceptada');
    return actualizada;
  });
