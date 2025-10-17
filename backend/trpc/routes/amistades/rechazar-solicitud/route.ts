import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { db } from "../../../../data/db";

export const rechazarSolicitudProcedure = publicProcedure
  .input(z.object({ amistadId: z.string() }))
  .mutation(({ input }) => {
    console.log('❌ Rechazando solicitud:', input.amistadId);
    
    const amistad = db.amistades.getById(input.amistadId);
    if (!amistad) {
      throw new Error('Solicitud no encontrada');
    }
    
    const actualizada = db.amistades.update(input.amistadId, {
      estado: 'rechazada',
      updatedAt: new Date().toISOString(),
    });
    
    console.log('✅ Solicitud rechazada');
    return actualizada;
  });
