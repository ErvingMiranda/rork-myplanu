import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { db } from "../../../../data/db";

export const solicitudesPendientesProcedure = publicProcedure
  .input(z.object({ usuarioId: z.string() }))
  .query(({ input }) => {
    console.log('📬 Obteniendo solicitudes pendientes para:', input.usuarioId);
    
    const solicitudes = db.amistades.getSolicitudesPendientes(input.usuarioId);
    
    const solicitudesConInfo = solicitudes.map(solicitud => {
      const usuario = db.usuarios.getById(solicitud.usuarioId);
      return {
        ...solicitud,
        usuario,
      };
    }).filter(s => s.usuario);
    
    console.log('✅ Solicitudes pendientes:', solicitudesConInfo.length);
    return solicitudesConInfo;
  });
