import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { authService } from '@/services/authService';
import { inicializarDB } from '@/data/database';
import type { Usuario } from '@/types';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [inicializado, setInicializado] = useState(false);

  useEffect(() => {
    inicializar();
  }, []);

  const inicializar = async () => {
    try {
      await inicializarDB();
      const usuarioActual = await authService.obtenerUsuarioActual();
      setUsuario(usuarioActual);
      setInicializado(true);
    } catch (error) {
      console.error('Error al inicializar auth:', error);
    } finally {
      setCargando(false);
    }
  };

  const registrar = useCallback(async (email: string, pin: string, nombre?: string) => {
    try {
      const nuevoUsuario = await authService.registrar(email, pin, nombre);
      setUsuario(nuevoUsuario);
      return nuevoUsuario;
    } catch (error) {
      console.error('Error al registrar:', error);
      throw error;
    }
  }, []);

  const iniciarSesion = useCallback(async (email: string, pin: string) => {
    try {
      const usuarioAutenticado = await authService.iniciarSesion(email, pin);
      setUsuario(usuarioAutenticado);
      return usuarioAutenticado;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }, []);

  const cerrarSesion = useCallback(async () => {
    try {
      await authService.cerrarSesion();
      setUsuario(null);
      router.replace('/onboarding' as any);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }, [router]);

  return useMemo(() => ({
    usuario,
    cargando,
    inicializado,
    estaAutenticado: !!usuario,
    registrar,
    iniciarSesion,
    cerrarSesion,
  }), [usuario, cargando, inicializado, registrar, iniciarSesion, cerrarSesion]);
});
