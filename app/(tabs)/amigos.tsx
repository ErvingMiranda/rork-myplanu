import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTema } from '@/hooks/useTema';
import { useAmigos } from '@/hooks/useAmigos';
import { UserPlus, Check, X, Search, Users as UsersIcon, Trash2 } from 'lucide-react-native';
import { GradientHeader } from '@/components/GradientHeader';
import type { Usuario } from '@/types';

export default function AmigosScreen() {
  const { colores } = useTema();
  const insets = useSafeAreaInsets();
  const {
    amigos,
    solicitudesPendientes,
    solicitudesEnviadas,
    enviarSolicitud,
    aceptarSolicitud,
    rechazarSolicitud,
    eliminarAmigo,
    buscarUsuarios,
  } = useAmigos();

  const [busqueda, setBusqueda] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState<Usuario[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [tabActiva, setTabActiva] = useState<'amigos' | 'solicitudes' | 'buscar'>('amigos');

  const handleBuscar = async () => {
    if (!busqueda.trim()) {
      Alert.alert('Info', 'Ingresa un email o nombre para buscar');
      return;
    }

    setBuscando(true);
    try {
      const usuarios = await buscarUsuarios(busqueda.trim());
      setResultadosBusqueda(usuarios);
      if (usuarios.length === 0) {
        Alert.alert('Sin resultados', 'No se encontraron usuarios');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al buscar usuarios');
    } finally {
      setBuscando(false);
    }
  };

  const handleEnviarSolicitud = async (usuarioId: string) => {
    try {
      await enviarSolicitud(usuarioId);
      Alert.alert('Éxito', 'Solicitud de amistad enviada');
      setResultadosBusqueda(prev => prev.filter(u => u.id !== usuarioId));
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al enviar solicitud');
    }
  };

  const handleAceptar = async (amistadId: string) => {
    try {
      await aceptarSolicitud(amistadId);
      Alert.alert('Éxito', '¡Ahora son amigos!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al aceptar solicitud');
    }
  };

  const handleRechazar = async (amistadId: string) => {
    try {
      await rechazarSolicitud(amistadId);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al rechazar solicitud');
    }
  };

  const handleEliminar = async (amigoId: string) => {
    Alert.alert(
      'Eliminar amigo',
      '¿Estás seguro de que quieres eliminar este amigo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarAmigo(amigoId);
              Alert.alert('Éxito', 'Amigo eliminado');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al eliminar amigo');
            }
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colores.surface,
    },
    headerContent: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 20,
    },
    tabsContainer: {
      flexDirection: 'row',
      gap: 8,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
      alignItems: 'center',
      backgroundColor: colores.card,
      borderWidth: 1,
      borderColor: colores.border,
    },
    tabActiva: {
      backgroundColor: colores.primary,
      borderColor: colores.primary,
    },
    tabTexto: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colores.text,
    },
    tabTextoActiva: {
      color: '#FFFFFF',
    },
    scrollContent: {
      paddingTop: 16,
      paddingHorizontal: 16,
      paddingBottom: insets.bottom + 80,
    },
    seccion: {
      marginBottom: 24,
    },
    seccionTitulo: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: colores.text,
      marginBottom: 12,
    },
    busquedaContainer: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
    },
    inputBusqueda: {
      flex: 1,
      backgroundColor: colores.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colores.border,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colores.text,
    },
    botonBuscar: {
      backgroundColor: colores.primary,
      borderRadius: 12,
      width: 48,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tarjeta: {
      backgroundColor: colores.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderWidth: 1,
      borderColor: colores.border,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colores.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarTexto: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: '#FFFFFF',
    },
    infoContainer: {
      flex: 1,
    },
    nombre: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: colores.text,
      marginBottom: 2,
    },
    email: {
      fontSize: 13,
      color: colores.textSecondary,
    },
    botonesContainer: {
      flexDirection: 'row',
      gap: 8,
    },
    botonIcono: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    botonAceptar: {
      backgroundColor: colores.primary,
    },
    botonRechazar: {
      backgroundColor: '#EF4444',
    },
    botonEliminar: {
      backgroundColor: '#EF4444',
    },
    botonAgregar: {
      backgroundColor: colores.primary,
    },
    vacio: {
      alignItems: 'center',
      paddingVertical: 32,
      gap: 12,
    },
    vacioTexto: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colores.textSecondary,
      textAlign: 'center',
    },
    badge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: '#EF4444',
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
    },
    badgeTexto: {
      fontSize: 12,
      fontWeight: '700' as const,
      color: '#FFFFFF',
    },
  });

  const renderAmigo = (amigo: any) => {
    const inicial = amigo.usuario.nombre ? amigo.usuario.nombre[0].toUpperCase() : amigo.usuario.email[0].toUpperCase();
    
    return (
      <View key={amigo.id} style={styles.tarjeta}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{inicial}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.nombre}>{amigo.usuario.nombre || 'Sin nombre'}</Text>
          <Text style={styles.email}>{amigo.usuario.email}</Text>
        </View>
        <TouchableOpacity
          style={[styles.botonIcono, styles.botonEliminar]}
          onPress={() => handleEliminar(amigo.usuario.id)}
        >
          <Trash2 size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderSolicitudPendiente = (solicitud: any) => {
    const inicial = solicitud.usuario.nombre ? solicitud.usuario.nombre[0].toUpperCase() : solicitud.usuario.email[0].toUpperCase();
    
    return (
      <View key={solicitud.id} style={styles.tarjeta}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{inicial}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.nombre}>{solicitud.usuario.nombre || 'Sin nombre'}</Text>
          <Text style={styles.email}>{solicitud.usuario.email}</Text>
        </View>
        <View style={styles.botonesContainer}>
          <TouchableOpacity
            style={[styles.botonIcono, styles.botonAceptar]}
            onPress={() => handleAceptar(solicitud.id)}
          >
            <Check size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.botonIcono, styles.botonRechazar]}
            onPress={() => handleRechazar(solicitud.id)}
          >
            <X size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderUsuarioBusqueda = (usuario: Usuario) => {
    const inicial = usuario.nombre ? usuario.nombre[0].toUpperCase() : usuario.email[0].toUpperCase();
    const yaEnviada = solicitudesEnviadas.some(s => s.usuario.id === usuario.id);
    
    return (
      <View key={usuario.id} style={styles.tarjeta}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{inicial}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.nombre}>{usuario.nombre || 'Sin nombre'}</Text>
          <Text style={styles.email}>{usuario.email}</Text>
        </View>
        {yaEnviada ? (
          <Text style={{ fontSize: 12, color: colores.textSecondary }}>Enviada</Text>
        ) : (
          <TouchableOpacity
            style={[styles.botonIcono, styles.botonAgregar]}
            onPress={() => handleEnviarSolicitud(usuario.id)}
          >
            <UserPlus size={18} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <GradientHeader
        title="Amigos"
        subtitle="Conecta con otros usuarios"
        startColor={colores.gradientStart}
        endColor={colores.gradientEnd}
        height={180}
        overlap={0}
      />
      <View style={styles.headerContent}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, tabActiva === 'amigos' && styles.tabActiva]}
            onPress={() => setTabActiva('amigos')}
          >
            <Text style={[styles.tabTexto, tabActiva === 'amigos' && styles.tabTextoActiva]}>
              Mis amigos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tabActiva === 'solicitudes' && styles.tabActiva]}
            onPress={() => setTabActiva('solicitudes')}
          >
            <View>
              <Text style={[styles.tabTexto, tabActiva === 'solicitudes' && styles.tabTextoActiva]}>
                Solicitudes
              </Text>
              {solicitudesPendientes.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeTexto}>{solicitudesPendientes.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tabActiva === 'buscar' && styles.tabActiva]}
            onPress={() => setTabActiva('buscar')}
          >
            <Text style={[styles.tabTexto, tabActiva === 'buscar' && styles.tabTextoActiva]}>
              Buscar
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {tabActiva === 'amigos' && (
          <View style={styles.seccion}>
            {amigos.length === 0 ? (
              <View style={styles.vacio}>
                <UsersIcon size={48} color={colores.textSecondary} />
                <Text style={styles.vacioTexto}>Aún no tienes amigos.{'\n'}Busca usuarios y envía solicitudes</Text>
              </View>
            ) : (
              amigos.map(renderAmigo)
            )}
          </View>
        )}

        {tabActiva === 'solicitudes' && (
          <View style={styles.seccion}>
            {solicitudesPendientes.length === 0 ? (
              <View style={styles.vacio}>
                <UsersIcon size={48} color={colores.textSecondary} />
                <Text style={styles.vacioTexto}>No tienes solicitudes pendientes</Text>
              </View>
            ) : (
              <>
                <Text style={styles.seccionTitulo}>Solicitudes recibidas</Text>
                {solicitudesPendientes.map(renderSolicitudPendiente)}
              </>
            )}

            {solicitudesEnviadas.length > 0 && (
              <>
                <Text style={styles.seccionTitulo}>Solicitudes enviadas</Text>
                {solicitudesEnviadas.map((sol) => {
                  const inicial = sol.usuario.nombre ? sol.usuario.nombre[0].toUpperCase() : sol.usuario.email[0].toUpperCase();
                  return (
                    <View key={sol.id} style={styles.tarjeta}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarTexto}>{inicial}</Text>
                      </View>
                      <View style={styles.infoContainer}>
                        <Text style={styles.nombre}>{sol.usuario.nombre || 'Sin nombre'}</Text>
                        <Text style={styles.email}>{sol.usuario.email}</Text>
                      </View>
                      <Text style={{ fontSize: 12, color: colores.textSecondary }}>Pendiente</Text>
                    </View>
                  );
                })}
              </>
            )}
          </View>
        )}

        {tabActiva === 'buscar' && (
          <View style={styles.seccion}>
            <View style={styles.busquedaContainer}>
              <TextInput
                style={styles.inputBusqueda}
                placeholder="Email o nombre..."
                placeholderTextColor={colores.textSecondary}
                value={busqueda}
                onChangeText={setBusqueda}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.botonBuscar}
                onPress={handleBuscar}
                disabled={buscando}
              >
                <Search size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {resultadosBusqueda.length > 0 && (
              <>
                <Text style={styles.seccionTitulo}>Resultados</Text>
                {resultadosBusqueda.map(renderUsuarioBusqueda)}
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
