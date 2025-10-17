import AsyncStorage from '@react-native-async-storage/async-storage';
import { UsuarioRepository } from '@/data/repositories/usuarioRepository';
import { validateEmail, validatePin, sanitizeEmail, sanitizeString } from '@/utils/validation';
import type { Usuario } from '@/types';

const AUTH_KEY = '@myplanu_auth';
const userRepo = new UsuarioRepository();

export class AuthService {
  async registrar(email: string, pin: string, nombre?: string): Promise<Usuario> {
    try {
      console.log('📝 Intentando registrar usuario:', email);
      
      const emailLimpio = sanitizeEmail(email);
      validateEmail(emailLimpio);
      validatePin(pin);
      
      const existente = await userRepo.obtenerPorEmail(emailLimpio);
      if (existente) {
        console.log('⚠️ El correo ya está registrado');
        throw new Error('El correo ya está registrado');
      }

      const nombreLimpio = nombre ? sanitizeString(nombre) : undefined;
      const usuario = await userRepo.crear({ 
        email: emailLimpio, 
        pin, 
        nombre: nombreLimpio,
        eventosPublicos: false,
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
      
      const usuario = await userRepo.verificarCredenciales(emailLimpio, pin);
      if (!usuario) {
        console.log('❌ No se encontró usuario con esas credenciales');
        throw new Error('Credenciales incorrectas');
      }

      console.log('✅ Usuario encontrado:', usuario.email);
      await this.guardarSesion(usuario.id);
      return usuario;
    } catch (error: any) {
      console.error('❌ Error en inicio de sesión:', error.message);
      throw error;
    }
  }

  async cerrarSesion(): Promise<void> {
    await AsyncStorage.removeItem(AUTH_KEY);
  }

  async obtenerUsuarioActual(): Promise<Usuario | null> {
    try {
      const userId = await AsyncStorage.getItem(AUTH_KEY);
      if (!userId) return null;

      return await userRepo.obtenerPorId(userId);
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
