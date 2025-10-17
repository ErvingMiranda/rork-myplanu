import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { db } from "../../../../data/db";

export const eliminarAmigoProcedure = publicProcedure
  .input(
    z.object({
      usuarioId: z.string(),
      amigoId: z.string(),
    })
  )
  .mutation(({ input }) => {
    console.log('🗑️ Eliminando amistad:', input.usuarioId, '<->', input.amigoId);
    
    const eliminado = db.amistades.delete(input.usuarioId, input.amigoId);
    
    if (!eliminado) {
      throw new Error('No se encontró la amistad');
    }
    
    console.log('✅ Amistad eliminada');
    return { success: true };
  });
