import AsyncStorage from '@react-native-async-storage/async-storage';
import { trpcClient } from '@/lib/trpc';
import { validateEmail, validatePin, sanitizeEmail, sanitizeString } from '@/utils/validation';
import type { Usuario } from '@/types';

const AUTH_KEY = '@myplanu_auth';

export class AuthService {
  async registrar(email: string, pin: string, nombre?: string): Promise<Usuario> {
    try {
      console.log('📝 Intentando registrar usuario:', email);
      
      const emailLimpio = sanitizeEmail(email);
      validateEmail(emailLimpio);
      validatePin(pin);
      
      const nombreLimpio = nombre ? sanitizeString(nombre) : undefined;
      const usuario = await trpcClient.usuarios.registrar.mutate({ 
        email: emailLimpio, 
        pin, 
        nombre: nombreLimpio,
      });
      console.log('✅ Usuario registrado exitosamente:', usuario.email);
      await this.guardarSesion(usuario.id);
      return usuario;
    } catch (error: any) {
      console.error('❌ Error en registro:', error.message);
      throw error;
    }
  }

  async iniciarSesion(email: string, pin: string): Promise<Usuario> {
    try {
      console.log('🔍 Verificando credenciales para:', email);
      
      const emailLimpio = sanitizeEmail(email);
      validateEmail(emailLimpio);
      validatePin(pin);
      
      const usuario = await trpcClient.usuarios.login.mutate({
        email: emailLimpio,
        pin,
      });

      console.log('✅ Usuario encontrado:', usuario.email);
      await this.guardarSesion(usuario.id);
      return usuario;
    } catch (error: any) {
      console.error('❌ Error en inicio de sesión:', error.message);
      throw new Error('Credenciales incorrectas');
    }
  }

  async cerrarSesion(): Promise<void> {
    await AsyncStorage.removeItem(AUTH_KEY);
  }

  async obtenerUsuarioActual(): Promise<Usuario | null> {
    try {
      const userId = await AsyncStorage.getItem(AUTH_KEY);
      if (!userId) return null;

      const usuario = await trpcClient.usuarios.obtenerPorId.query({ id: userId });
      return usuario;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  }

  async estaAutenticado(): Promise<boolean> {
    const usuario = await this.obtenerUsuarioActual();
    return !!usuario;
  }

  private async guardarSesion(userId: string): Promise<void> {
    await AsyncStorage.setItem(AUTH_KEY, userId);
  }
}

export const authService = new AuthService();
