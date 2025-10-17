import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { db } from "../../../../data/db";
import { TRPCError } from "@trpc/server";

export const loginProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      pin: z.string(),
    })
  )
  .mutation(({ input }) => {
    try {
      console.log('🔐 Intento de login:', input.email);
      const usuario = db.usuarios.getByEmail(input.email);
      
      if (!usuario) {
        console.log('❌ Usuario no encontrado');
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Credenciales incorrectas',
        });
      }
      
      if (usuario.pin !== input.pin) {
        console.log('❌ PIN incorrecto');
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Credenciales incorrectas',
        });
      }
      
      console.log('✅ Login exitoso');
      return usuario;
    } catch (error) {
      console.error('❌ Error en loginProcedure:', error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error al iniciar sesión',
        cause: error,
      });
    }
  });
