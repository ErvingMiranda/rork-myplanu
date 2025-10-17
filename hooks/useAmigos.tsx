import { useAuth } from './useAuth';
import { trpc, trpcClient } from '@/lib/trpc';
import type { Amistad, Usuario } from '@/types';

export interface AmigoConInfo extends Amistad {
  usuario: Usuario;
}

export function useAmigos() {
  const { usuario: usuarioActual } = useAuth();

  const amigosQuery = trpc.amistades.misAmigos.useQuery(
    { usuarioId: usuarioActual?.id || '' },
    { enabled: !!usuarioActual }
  );

  const solicitudesPendientesQuery = trpc.amistades.solicitudesPendientes.useQuery(
    { usuarioId: usuarioActual?.id || '' },
    { enabled: !!usuarioActual }
  );

  const solicitudesEnviadasQuery = trpc.amistades.solicitudesEnviadas.useQuery(
    { usuarioId: usuarioActual?.id || '' },
    { enabled: !!usuarioActual }
  );

  const enviarSolicitudMutation = trpc.amistades.enviarSolicitud.useMutation({
    onSuccess: () => {
      solicitudesEnviadasQuery.refetch();
      console.log('📤 Solicitud de amistad enviada');
    },
  });

  const aceptarSolicitudMutation = trpc.amistades.aceptarSolicitud.useMutation({
    onSuccess: () => {
      amigosQuery.refetch();
      solicitudesPendientesQuery.refetch();
      console.log('✅ Solicitud aceptada');
    },
  });

  const rechazarSolicitudMutation = trpc.amistades.rechazarSolicitud.useMutation({
    onSuccess: () => {
      solicitudesPendientesQuery.refetch();
      console.log('❌ Solicitud rechazada');
    },
  });

  const eliminarAmigoMutation = trpc.amistades.eliminarAmigo.useMutation({
    onSuccess: () => {
      amigosQuery.refetch();
      console.log('🗑️ Amigo eliminado');
    },
  });

  const enviarSolicitud = async (amigoId: string): Promise<void> => {
    if (!usuarioActual) throw new Error('No hay usuario autenticado');
    await enviarSolicitudMutation.mutateAsync({
      usuarioId: usuarioActual.id,
      amigoId,
    });
  };

  const aceptarSolicitud = async (amistadId: string): Promise<void> => {
    await aceptarSolicitudMutation.mutateAsync({ amistadId });
  };

  const rechazarSolicitud = async (amistadId: string): Promise<void> => {
    await rechazarSolicitudMutation.mutateAsync({ amistadId });
  };

  const eliminarAmigo = async (amigoId: string): Promise<void> => {
    if (!usuarioActual) throw new Error('No hay usuario autenticado');
    await eliminarAmigoMutation.mutateAsync({
      usuarioId: usuarioActual.id,
      amigoId,
    });
  };

  const buscarUsuarios = async (busqueda: string): Promise<Usuario[]> => {
    if (!usuarioActual) return [];
    
    const response = await trpcClient.usuarios.buscar.query({
      query: busqueda,
      excludeId: usuarioActual.id,
    });
    
    return response;
  };

  return {
    amigos: amigosQuery.data || [],
    solicitudesPendientes: solicitudesPendientesQuery.data || [],
    solicitudesEnviadas: solicitudesEnviadasQuery.data || [],
    cargando: amigosQuery.isLoading || solicitudesPendientesQuery.isLoading || solicitudesEnviadasQuery.isLoading,
    enviarSolicitud,
    aceptarSolicitud,
    rechazarSolicitud,
    eliminarAmigo,
    buscarUsuarios,
    recargar: () => {
      amigosQuery.refetch();
      solicitudesPendientesQuery.refetch();
      solicitudesEnviadasQuery.refetch();
    },
  };
}
