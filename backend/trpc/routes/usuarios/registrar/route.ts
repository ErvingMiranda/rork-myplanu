import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { db } from "../../../../data/db";
import { Usuario } from "@/types";
import { TRPCError } from "@trpc/server";

export const registrarProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      pin: z.string(),
      nombre: z.string().optional(),
    })
  )
  .mutation(({ input }) => {
    try {
      console.log('📝 Intento de registro:', input.email);
      
      const existente = db.usuarios.getByEmail(input.email);
      if (existente) {
        console.log('❌ Email ya registrado');
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Este email ya está registrado',
        });
      }
      
      const nuevoUsuario: Usuario = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: input.email,
        pin: input.pin,
        nombre: input.nombre,
        eventosPublicos: false,
        createdAt: new Date().toISOString(),
      };
      
      db.usuarios.create(nuevoUsuario);
      console.log('✅ Usuario registrado:', nuevoUsuario.id);
      return nuevoUsuario;
    } catch (error) {
      console.error('❌ Error en registrarProcedure:', error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error al registrar usuario',
        cause: error,
      });
    }
  });
