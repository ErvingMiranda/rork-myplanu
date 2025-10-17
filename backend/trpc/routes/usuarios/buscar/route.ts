import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { db } from "../../../../data/db";

export const buscarUsuariosProcedure = publicProcedure
  .input(
    z.object({
      query: z.string(),
      excludeId: z.string().optional(),
    })
  )
  .query(({ input }) => {
    console.log('🔍 Buscando usuarios:', input.query);
    const usuarios = db.usuarios.search(input.query, input.excludeId);
    console.log('✅ Encontrados:', usuarios.length);
    return usuarios;
  });
