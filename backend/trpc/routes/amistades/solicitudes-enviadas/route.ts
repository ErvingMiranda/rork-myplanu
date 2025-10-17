import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { db } from "../../../../data/db";

export const solicitudesEnviadasProcedure = publicProcedure
  .input(z.object({ usuarioId: z.string() }))
  .query(({ input }) => {
    console.log('📤 Obteniendo solicitudes enviadas por:', input.usuarioId);
    
    const solicitudes = db.amistades.getSolicitudesEnviadas(input.usuarioId);
    
    const solicitudesConInfo = solicitudes.map(solicitud => {
      const usuario = db.usuarios.getById(solicitud.amigoId);
      return {
        ...solicitud,
        usuario,
      };
    }).filter(s => s.usuario);
    
    console.log('✅ Solicitudes enviadas:', solicitudesConInfo.length);
    return solicitudesConInfo;
  });
