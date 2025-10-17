import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { db } from "../../../../data/db";

export const obtenerPorIdProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(({ input }) => {
    console.log('🔍 Buscando usuario por ID:', input.id);
    const usuario = db.usuarios.getById(input.id);
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    
    return usuario;
  });
