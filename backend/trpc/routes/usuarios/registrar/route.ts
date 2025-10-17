import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { db } from "../../../../data/db";
import { Usuario } from "@/types";

export const registrarProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      pin: z.string(),
      nombre: z.string().optional(),
    })
  )
  .mutation(({ input }) => {
    console.log('📝 Intento de registro:', input.email);
    
    const existente = db.usuarios.getByEmail(input.email);
    if (existente) {
      console.log('❌ Email ya registrado');
      throw new Error('Este email ya está registrado');
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
  });
