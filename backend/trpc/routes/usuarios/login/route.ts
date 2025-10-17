import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { db } from "../../../../data/db";

export const loginProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      pin: z.string(),
    })
  )
  .mutation(({ input }) => {
    console.log('🔐 Intento de login:', input.email);
    const usuario = db.usuarios.getByEmail(input.email);
    
    if (!usuario) {
      console.log('❌ Usuario no encontrado');
      throw new Error('Credenciales incorrectas');
    }
    
    if (usuario.pin !== input.pin) {
      console.log('❌ PIN incorrecto');
      throw new Error('Credenciales incorrectas');
    }
    
    console.log('✅ Login exitoso');
    return usuario;
  });
