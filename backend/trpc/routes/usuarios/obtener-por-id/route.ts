import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { db } from "../../../../data/db";
import { TRPCError } from "@trpc/server";

export const obtenerPorIdProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(({ input }) => {
    try {
      console.log('🔍 Buscando usuario por ID:', input.id);
      const usuario = db.usuarios.getById(input.id);
      
      if (!usuario) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Usuario no encontrado',
        });
      }
      
      return usuario;
    } catch (error) {
      console.error('❌ Error en obtenerPorIdProcedure:', error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error al obtener usuario',
        cause: error,
      });
    }
  });
