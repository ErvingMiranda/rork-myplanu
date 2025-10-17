import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { db } from '../../../../data/db';
import { TRPCError } from '@trpc/server';

export const actualizarUsuarioProcedure = publicProcedure
  .input(z.object({
    usuarioId: z.string(),
    nombre: z.string().optional(),
    descripcion: z.string().optional(),
    fotoPerfil: z.string().optional(),
    eventosPublicos: z.boolean().optional(),
  }))
  .mutation(({ input }) => {
    try {
      console.log('📝 Actualizando usuario:', input.usuarioId);
      const usuario = db.usuarios.getById(input.usuarioId);
      
      if (!usuario) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Usuario no encontrado',
        });
      }

      const usuarioActualizado = {
        ...usuario,
        ...(input.nombre !== undefined && { nombre: input.nombre }),
        ...(input.descripcion !== undefined && { descripcion: input.descripcion }),
        ...(input.fotoPerfil !== undefined && { fotoPerfil: input.fotoPerfil }),
        ...(input.eventosPublicos !== undefined && { eventosPublicos: input.eventosPublicos }),
      };

      db.usuarios.update(input.usuarioId, usuarioActualizado);
      
      console.log('✅ Usuario actualizado correctamente');
      return usuarioActualizado;
    } catch (error) {
      console.error('❌ Error en actualizarUsuarioProcedure:', error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error al actualizar usuario',
        cause: error,
      });
    }
  });
