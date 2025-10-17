import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { db } from "../../../../data/db";
import { Amistad } from "@/types";

export const enviarSolicitudProcedure = publicProcedure
  .input(
    z.object({
      usuarioId: z.string(),
      amigoId: z.string(),
    })
  )
  .mutation(({ input }) => {
    console.log('📤 Enviando solicitud de amistad:', input.usuarioId, '->', input.amigoId);
    
    if (input.usuarioId === input.amigoId) {
      throw new Error('No puedes enviarte una solicitud a ti mismo');
    }
    
    const usuarioDestino = db.usuarios.getById(input.amigoId);
    if (!usuarioDestino) {
      throw new Error('Usuario no encontrado');
    }
    
    const solicitudExistente = db.amistades.getAll().find(a => 
      ((a.usuarioId === input.usuarioId && a.amigoId === input.amigoId) || 
       (a.usuarioId === input.amigoId && a.amigoId === input.usuarioId)) &&
      a.estado !== 'rechazada'
    );
    
    if (solicitudExistente) {
      if (solicitudExistente.estado === 'aceptada') {
        throw new Error('Ya son amigos');
      } else {
        throw new Error('Ya hay una solicitud pendiente');
      }
    }
    
    const nuevaAmistad: Amistad = {
      id: `friend_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      usuarioId: input.usuarioId,
      amigoId: input.amigoId,
      estado: 'pendiente',
      solicitadoPor: input.usuarioId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    db.amistades.create(nuevaAmistad);
    console.log('✅ Solicitud creada:', nuevaAmistad.id);
    return nuevaAmistad;
  });
