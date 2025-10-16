import { obtenerUsuarios, guardarUsuarios } from '../database';
import type { Usuario } from '@/types';

export interface BuscarUsuarioParams {
  email?: string;
  nombre?: string;
  excluirId?: string;
}

export class UsuarioRepository {
  async crear(usuario: Omit<Usuario, 'id' | 'createdAt'>): Promise<Usuario> {
    const usuarios = await obtenerUsuarios();
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();

    const nuevoUsuario: Usuario = { 
      ...usuario, 
      id, 
      createdAt,
      eventosPublicos: usuario.eventosPublicos ?? false,
    };
    usuarios.push(nuevoUsuario);
    await guardarUsuarios(usuarios);

    return nuevoUsuario;
  }

  async obtenerPorEmail(email: string): Promise<Usuario | null> {
    const usuarios = await obtenerUsuarios();
    return usuarios.find((u: Usuario) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async obtenerPorId(id: string): Promise<Usuario | null> {
    const usuarios = await obtenerUsuarios();
    return usuarios.find((u: Usuario) => u.id === id) || null;
  }

  async verificarCredenciales(email: string, pin: string): Promise<Usuario | null> {
    const usuarios = await obtenerUsuarios();
    console.log('📋 Total usuarios en BD:', usuarios.length);
    console.log('🔍 Buscando:', email.toLowerCase(), 'PIN:', pin);
    
    const usuario = usuarios.find((u: Usuario) => {
      const emailMatch = u.email.toLowerCase() === email.toLowerCase();
      const pinMatch = u.pin === pin;
      console.log('  Comparando con:', u.email.toLowerCase(), 'email match:', emailMatch, 'pin match:', pinMatch);
      return emailMatch && pinMatch;
    }) || null;
    
    if (usuario) {
      console.log('✅ Usuario encontrado:', usuario.email);
    } else {
      console.log('❌ No se encontró usuario con esas credenciales');
    }
    
    return usuario;
  }

  async actualizar(id: string, datos: Partial<Usuario>): Promise<void> {
    const usuarios = await obtenerUsuarios();
    const index = usuarios.findIndex((u: Usuario) => u.id === id);
    
    if (index === -1) return;

    usuarios[index] = { ...usuarios[index], ...datos };
    await guardarUsuarios(usuarios);
  }

  async buscar(params: BuscarUsuarioParams): Promise<Usuario[]> {
    const usuarios = await obtenerUsuarios();
    return usuarios.filter((u: Usuario) => {
      if (params.excluirId && u.id === params.excluirId) return false;
      if (params.email && !u.email.toLowerCase().includes(params.email.toLowerCase())) return false;
      if (params.nombre && u.nombre && !u.nombre.toLowerCase().includes(params.nombre.toLowerCase())) return false;
      return true;
    });
  }

  async obtenerTodos(): Promise<Usuario[]> {
    return await obtenerUsuarios();
  }
}
