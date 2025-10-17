import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { db } from "../../../../data/db";
import { TRPCError } from "@trpc/server";

export const buscarUsuariosProcedure = publicProcedure
  .input(
    z.object({
      query: z.string(),
      excludeId: z.string().optional(),
    })
  )
  .query(({ input }) => {
    try {
      console.log('🔍 Buscando usuarios:', input.query);
      const usuarios = db.usuarios.search(input.query, input.excludeId);
      console.log('✅ Encontrados:', usuarios.length);
      return usuarios;
    } catch (error) {
      console.error('❌ Error en buscarUsuariosProcedure:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error al buscar usuarios',
        cause: error,
      });
    }
  });
