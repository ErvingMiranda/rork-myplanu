import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { db } from "../../../../data/db";

export const misAmigosProcedure = publicProcedure
  .input(z.object({ usuarioId: z.string() }))
  .query(({ input }) => {
    console.log('👥 Obteniendo amigos de:', input.usuarioId);
    
    const amistades = db.amistades.getByUsuario(input.usuarioId, 'aceptada');
    
    const amigosConInfo = amistades.map(amistad => {
      const amigoId = amistad.usuarioId === input.usuarioId ? amistad.amigoId : amistad.usuarioId;
      const usuario = db.usuarios.getById(amigoId);
      
      return {
        ...amistad,
        usuario,
      };
    }).filter(a => a.usuario);
    
    console.log('✅ Amigos encontrados:', amigosConInfo.length);
    return amigosConInfo;
  });
