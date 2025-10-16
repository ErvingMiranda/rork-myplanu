import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTema } from '@/hooks/useTema';
import { useAuth } from '@/hooks/useAuth';
import { useAmigos } from '@/hooks/useAmigos';
import { SolicitudEventoRepository } from '@/data/repositories/solicitudEventoRepository';
import { EventoRepository } from '@/data/repositories/eventoRepository';
import { UsuarioRepository } from '@/data/repositories/usuarioRepository';
import { Bell, UserPlus, Calendar, Check, X } from 'lucide-react-native';
import type { SolicitudEvento, Evento, Usuario } from '@/types';

const solicitudEventoRepo = new SolicitudEventoRepository();
const eventoRepo = new EventoRepository();
const usuarioRepo = new UsuarioRepository();

interface SolicitudEventoConInfo extends SolicitudEvento {
  evento: Evento;
  remitente: Usuario;
}

export default function NotificacionesScreen() {
  const { colores } = useTema();
  const router = useRouter();
  const { usuario } = useAuth();
  const { solicitudesPendientes, aceptarSolicitud, rechazarSolicitud } = useAmigos();
  
  const [solicitudesEvento, setSolicitudesEvento] = useState<SolicitudEventoConInfo[]>([]);
  const [cargando, setCargando] = useState(false);

  const cargarSolicitudesEvento = async () => {
    if (!usuario) return;

    setCargando(true);
    try {
      const solicitudes = await solicitudEventoRepo.obtenerPorDestinatario(usuario.id);
      
      const solicitudesConInfo: SolicitudEventoConInfo[] = await Promise.all(
        solicitudes.map(async (solicitud) => {
          const evento = await eventoRepo.obtenerPorId(solicitud.eventoId);
          const remitente = await usuarioRepo.obtenerPorId(solicitud.remitenteId);
          
          return {
            ...solicitud,
            evento: evento!,
            remitente: remitente!,
          };
        })
      );

      setSolicitudesEvento(solicitudesConInfo.filter(s => s.evento && s.remitente));
    } catch (error) {
      console.error('Error cargando solicitudes de evento:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSolicitudesEvento();
  }, [usuario]);

  const handleAceptarAmistad = async (amistadId: string) => {
    try {
      await aceptarSolicitud(amistadId);
      Alert.alert('Éxito', '¡Ahora son amigos!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al aceptar solicitud');
    }
  };

  const handleRechazarAmistad = async (amistadId: string) => {
    try {
      await rechazarSolicitud(amistadId);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al rechazar solicitud');
    }
  };

  const handleAceptarEvento = async (solicitudId: string, eventoId: string) => {
    try {
      await solicitudEventoRepo.aceptar(solicitudId);
      
      const evento = await eventoRepo.obtenerPorId(eventoId);
      if (evento && usuario) {
        const usuariosCompartidos = evento.usuariosCompartidos || [];
        if (!usuariosCompartidos.includes(usuario.id)) {
          usuariosCompartidos.push(usuario.id);
        }
        
        await eventoRepo.actualizar(eventoId, {
          esCompartido: true,
          usuariosCompartidos,
        });
      }

      Alert.alert('Éxito', 'Ahora compartes este evento');
      await cargarSolicitudesEvento();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al aceptar evento');
    }
  };

  const handleRechazarEvento = async (solicitudId: string) => {
    try {
      await solicitudEventoRepo.rechazar(solicitudId);
      await cargarSolicitudesEvento();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al rechazar evento');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colores.background,
    },
    scrollContent: {
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 24,
    },
    headerIcono: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colores.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTextos: {
      flex: 1,
    },
    titulo: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: colores.text,
    },
    subtitulo: {
      fontSize: 14,
      color: colores.textSecondary,
    },
    seccion: {
      marginBottom: 24,
    },
    seccionTitulo: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colores.text,
      marginBottom: 12,
    },
    tarjeta: {
      backgroundColor: colores.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colores.border,
    },
    tarjetaHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colores.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarTexto: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: '#FFFFFF',
    },
    tarjetaInfo: {
      flex: 1,
    },
    tarjetaTitulo: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: colores.text,
      marginBottom: 2,
    },
    tarjetaSubtitulo: {
      fontSize: 13,
      color: colores.textSecondary,
    },
    tarjetaDescripcion: {
      fontSize: 14,
      color: colores.text,
      marginBottom: 12,
    },
    botonesContainer: {
      flexDirection: 'row',
      gap: 8,
    },
    boton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    botonAceptar: {
      backgroundColor: colores.primary,
    },
    botonRechazar: {
      backgroundColor: colores.card,
      borderWidth: 1,
      borderColor: colores.border,
    },
    botonTexto: {
      fontSize: 14,
      fontWeight: '600' as const,
    },
    botonTextoAceptar: {
      color: '#FFFFFF',
    },
    botonTextoRechazar: {
      color: colores.text,
    },
    vacio: {
      alignItems: 'center',
      paddingVertical: 48,
    },
    vacioTexto: {
      fontSize: 16,
      color: colores.textSecondary,
      textAlign: 'center',
      marginTop: 12,
    },
  });

  const totalNotificaciones = solicitudesPendientes.length + solicitudesEvento.length;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerIcono}>
            <Bell size={24} color="#FFFFFF" />
          </View>
          <View style={styles.headerTextos}>
            <Text style={styles.titulo}>Notificaciones</Text>
            <Text style={styles.subtitulo}>
              {totalNotificaciones === 0 
                ? 'No tienes notificaciones nuevas'
                : `${totalNotificaciones} notificación${totalNotificaciones > 1 ? 'es' : ''} nueva${totalNotificaciones > 1 ? 's' : ''}`
              }
            </Text>
          </View>
        </View>

        {solicitudesPendientes.length > 0 && (
          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>Solicitudes de amistad</Text>
            {solicitudesPendientes.map((solicitud) => {
              const inicial = solicitud.usuario.nombre 
                ? solicitud.usuario.nombre[0].toUpperCase()
                : solicitud.usuario.email[0].toUpperCase();

              return (
                <View key={solicitud.id} style={styles.tarjeta}>
                  <View style={styles.tarjetaHeader}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarTexto}>{inicial}</Text>
                    </View>
                    <View style={styles.tarjetaInfo}>
                      <Text style={styles.tarjetaTitulo}>
                        {solicitud.usuario.nombre || 'Usuario'}
                      </Text>
                      <Text style={styles.tarjetaSubtitulo}>
                        {solicitud.usuario.email}
                      </Text>
                    </View>
                    <UserPlus size={20} color={colores.primary} />
                  </View>
                  <Text style={styles.tarjetaDescripcion}>
                    Te ha enviado una solicitud de amistad
                  </Text>
                  <View style={styles.botonesContainer}>
                    <TouchableOpacity
                      style={[styles.boton, styles.botonAceptar]}
                      onPress={() => handleAceptarAmistad(solicitud.id)}
                    >
                      <Check size={16} color="#FFFFFF" />
                      <Text style={[styles.botonTexto, styles.botonTextoAceptar]}>
                        Aceptar
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.boton, styles.botonRechazar]}
                      onPress={() => handleRechazarAmistad(solicitud.id)}
                    >
                      <X size={16} color={colores.text} />
                      <Text style={[styles.botonTexto, styles.botonTextoRechazar]}>
                        Rechazar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {solicitudesEvento.length > 0 && (
          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>Eventos compartidos</Text>
            {solicitudesEvento.map((solicitud) => {
              const inicial = solicitud.remitente.nombre 
                ? solicitud.remitente.nombre[0].toUpperCase()
                : solicitud.remitente.email[0].toUpperCase();

              return (
                <View key={solicitud.id} style={styles.tarjeta}>
                  <View style={styles.tarjetaHeader}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarTexto}>{inicial}</Text>
                    </View>
                    <View style={styles.tarjetaInfo}>
                      <Text style={styles.tarjetaTitulo}>
                        {solicitud.remitente.nombre || 'Usuario'}
                      </Text>
                      <Text style={styles.tarjetaSubtitulo}>
                        Quiere compartir un evento
                      </Text>
                    </View>
                    <Calendar size={20} color={colores.primary} />
                  </View>
                  <Text style={styles.tarjetaDescripcion}>
                    Evento: {solicitud.evento.titulo}
                  </Text>
                  <View style={styles.botonesContainer}>
                    <TouchableOpacity
                      style={[styles.boton, styles.botonAceptar]}
                      onPress={() => handleAceptarEvento(solicitud.id, solicitud.eventoId)}
                    >
                      <Check size={16} color="#FFFFFF" />
                      <Text style={[styles.botonTexto, styles.botonTextoAceptar]}>
                        Aceptar
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.boton, styles.botonRechazar]}
                      onPress={() => handleRechazarEvento(solicitud.id)}
                    >
                      <X size={16} color={colores.text} />
                      <Text style={[styles.botonTexto, styles.botonTextoRechazar]}>
                        Rechazar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {totalNotificaciones === 0 && (
          <View style={styles.vacio}>
            <Bell size={64} color={colores.textSecondary} />
            <Text style={styles.vacioTexto}>
              No tienes notificaciones pendientes
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
