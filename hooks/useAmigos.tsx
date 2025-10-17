import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { AmistadRepository } from '@/data/repositories/amistadRepository';
import { UsuarioRepository } from '@/data/repositories/usuarioRepository';
import type { Amistad, Usuario } from '@/types';

const amistadRepo = new AmistadRepository();
const usuarioRepo = new UsuarioRepository();

export interface AmigoConInfo extends Amistad {
  usuario: Usuario;
}

export function useAmigos() {
  const { usuario: usuarioActual } = useAuth();
  const [amigos, setAmigos] = useState<AmigoConInfo[]>([]);
  const [solicitudesPendientes, setSolicitudesPendientes] = useState<AmigoConInfo[]>([]);
  const [solicitudesEnviadas, setSolicitudesEnviadas] = useState<AmigoConInfo[]>([]);
  const [cargando, setCargando] = useState(false);

  const cargarAmigos = async () => {
    if (!usuarioActual) return;

    setCargando(true);
    try {
      const amistades = await amistadRepo.obtenerAmigos(usuarioActual.id);
      
      const amigosConInfo: AmigoConInfo[] = await Promise.all(
        amistades.map(async (amistad) => {
          const amigoId = amistad.usuarioId === usuarioActual.id ? amistad.amigoId : amistad.usuarioId;
          const usuario = await usuarioRepo.obtenerPorId(amigoId);
          return {
            ...amistad,
            usuario: usuario!,
          };
        })
      );

      setAmigos(amigosConInfo.filter(a => a.usuario));
    } catch (error) {
      console.error('Error cargando amigos:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarSolicitudes = async () => {
    if (!usuarioActual) return;

    try {
      const pendientes = await amistadRepo.obtenerSolicitudesPendientes(usuarioActual.id);
      const enviadas = await amistadRepo.obtenerSolicitudesEnviadas(usuarioActual.id);

      const pendientesConInfo: AmigoConInfo[] = await Promise.all(
        pendientes.map(async (solicitud) => {
          const usuario = await usuarioRepo.obtenerPorId(solicitud.usuarioId);
          return {
            ...solicitud,
            usuario: usuario!,
          };
        })
      );

      const enviadasConInfo: AmigoConInfo[] = await Promise.all(
        enviadas.map(async (solicitud) => {
          const usuario = await usuarioRepo.obtenerPorId(solicitud.amigoId);
          return {
            ...solicitud,
            usuario: usuario!,
          };
        })
      );

      setSolicitudesPendientes(pendientesConInfo.filter(s => s.usuario));
      setSolicitudesEnviadas(enviadasConInfo.filter(s => s.usuario));
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
    }
  };

  const enviarSolicitud = async (amigoId: string): Promise<void> => {
    if (!usuarioActual) throw new Error('No hay usuario autenticado');
    
    await amistadRepo.crear(usuarioActual.id, amigoId);
    await cargarSolicitudes();
    console.log('📤 Solicitud de amistad enviada');
  };

  const aceptarSolicitud = async (amistadId: string): Promise<void> => {
    await amistadRepo.aceptarSolicitud(amistadId);
    await cargarAmigos();
    await cargarSolicitudes();
    console.log('✅ Solicitud aceptada');
  };

  const rechazarSolicitud = async (amistadId: string): Promise<void> => {
    await amistadRepo.rechazarSolicitud(amistadId);
    await cargarSolicitudes();
    console.log('❌ Solicitud rechazada');
  };

  const eliminarAmigo = async (amigoId: string): Promise<void> => {
    if (!usuarioActual) throw new Error('No hay usuario autenticado');
    
    await amistadRepo.eliminarAmistad(usuarioActual.id, amigoId);
    await cargarAmigos();
    console.log('🗑️ Amigo eliminado');
  };

  const buscarUsuarios = async (busqueda: string): Promise<Usuario[]> => {
    if (!usuarioActual) return [];
    
    const usuarios = await usuarioRepo.buscar({
      email: busqueda,
      nombre: busqueda,
      excluirId: usuarioActual.id,
    });
    
    return usuarios;
  };

  useEffect(() => {
    if (usuarioActual) {
      cargarAmigos();
      cargarSolicitudes();
    }
  }, [usuarioActual]);

  return {
    amigos,
    solicitudesPendientes,
    solicitudesEnviadas,
    cargando,
    enviarSolicitud,
    aceptarSolicitud,
    rechazarSolicitud,
    eliminarAmigo,
    buscarUsuarios,
    recargar: () => {
      cargarAmigos();
      cargarSolicitudes();
    },
  };
}
