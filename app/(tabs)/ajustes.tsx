import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Sun, Moon, Bell, Info, User, ChevronRight, Users as UsersIcon, BellDot } from 'lucide-react-native';
import { BORDES, SOMBRAS } from '@/constants/theme';
import { useTema } from '@/hooks/useTema';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { useAmigos } from '@/hooks/useAmigos';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { GradientHeader, useGradientHeaderOverlap } from '@/components/GradientHeader';

export default function AjustesScreen() {
  const router = useRouter();
  const { colores, ajustes, actualizarAjustes, isDark } = useTema();
  const { usuario, cerrarSesion, eliminarCuenta, actualizarUsuario } = useAuth();
  const { solicitudesPendientes } = useAmigos();
  const eliminarUsuarioMutation = trpc.usuarios.eliminar.useMutation();
  const actualizarUsuarioMutation = trpc.usuarios.actualizar.useMutation();
  const PROFILE_OVERLAP = 12;
  const overlapStyle = useGradientHeaderOverlap(PROFILE_OVERLAP);

  const handleCerrarSesion = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: cerrarSesion 
        },
      ]
    );
  };

  const handleEliminarCuenta = () => {
    Alert.alert(
      'Eliminar Cuenta',
      '¿Estás seguro? Esta acción eliminará permanentemente tu cuenta y todos tus datos, incluyendo eventos, amistades y solicitudes. Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarUsuarioMutation.mutateAsync({ usuarioId: usuario?.id || '' });
              await eliminarCuenta();
              Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada exitosamente');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'No se pudo eliminar la cuenta');
            }
          }
        },
      ]
    );
  };

  const toggleTema = () => {
    const nuevoTema = isDark ? 'light' : 'dark';
    actualizarAjustes({ tema: nuevoTema });
  };

  const toggleNotificaciones = (value: boolean) => {
    actualizarAjustes({ notificacionesHabilitadas: value });
  };

  const toggleVibracion = (value: boolean) => {
    actualizarAjustes({ vibracionHabilitada: value });
  };

  const toggleEventosPublicos = async (value: boolean) => {
    try {
      const usuarioActualizado = await actualizarUsuarioMutation.mutateAsync({
        usuarioId: usuario?.id || '',
        eventosPublicos: value,
      });
      actualizarUsuario(usuarioActualizado);
      Alert.alert(
        'Éxito',
        value 
          ? 'Tus amigos ahora pueden ver tus eventos de hoy'
          : 'Tus eventos ahora son privados'
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al actualizar configuración');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colores.surface,
    },

    scrollContent: {
      paddingTop: 0,
      paddingBottom: 32,
    },
    tarjetaPerfil: {
      ...overlapStyle,
      marginHorizontal: 16,
      marginBottom: 24,
      backgroundColor: colores.card,
      borderRadius: BORDES.card,
      padding: 20,
      ...SOMBRAS.media,
      alignItems: 'center',
      position: 'relative' as const,
      zIndex: 1,
    },
    perfilAvatar: {
      width: 80,
      height: 80,
      borderRadius: BORDES.redondo,
      backgroundColor: colores.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      overflow: 'hidden' as const,
    },
    perfilNombre: {
      fontSize: 22,
      fontWeight: '700' as const,
      color: colores.text,
      marginBottom: 4,
    },
    perfilEmail: {
      fontSize: 14,
      color: colores.textSecondary,
      marginBottom: 8,
    },
    perfilDescripcion: {
      fontSize: 13,
      color: colores.textSecondary,
      textAlign: 'center',
      marginBottom: 12,
      paddingHorizontal: 16,
      lineHeight: 18,
    },
    editarIndicador: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 8,
    },
    editarTexto: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colores.primary,
    },
    seccion: {
      marginBottom: 24,
      paddingHorizontal: 16,
    },
    seccionTitulo: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colores.text,
      marginBottom: 12,
    },
    opcionCard: {
      marginBottom: 12,
      padding: 16,
    },
    opcion: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    opcionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    opcionTextos: {
      flex: 1,
    },
    opcionTitulo: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colores.text,
      marginBottom: 2,
    },
    opcionDescripcion: {
      fontSize: 14,
      color: colores.textSecondary,
    },
    version: {
      fontSize: 12,
      color: colores.textSecondary,
      textAlign: 'center',
      marginTop: 24,
      marginBottom: 16,
    },
  });

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Ajustes',
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        <GradientHeader
          title="Ajustes"
          subtitle={usuario?.nombre || 'Usuario'}
          startColor={colores.gradientStart}
          endColor={colores.gradientEnd}
          overlap={PROFILE_OVERLAP}
          leftIcon={
            <View style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <User size={32} color="#FFFFFF" />
            </View>
          }
        />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity 
            onPress={() => router.push('/editar-perfil' as any)}
            style={styles.tarjetaPerfil}
            activeOpacity={0.7}
          >
            <View style={styles.perfilAvatar}>
              {usuario?.fotoPerfil && usuario.fotoPerfil.trim() !== '' ? (
                <Image 
                  source={{ uri: usuario.fotoPerfil }} 
                  style={{ width: 80, height: 80, borderRadius: BORDES.redondo }}
                  resizeMode="cover"
                  onError={() => console.log('Error cargando imagen de perfil')}
                />
              ) : (
                <User size={40} color="#FFFFFF" />
              )}
            </View>
            <Text style={styles.perfilNombre}>{usuario?.nombre || 'Usuario'}</Text>
            <Text style={styles.perfilEmail}>{usuario?.email}</Text>
            {usuario?.descripcion && (
              <Text style={styles.perfilDescripcion}>{usuario.descripcion}</Text>
            )}
            <View style={styles.editarIndicador}>
              <Text style={styles.editarTexto}>Editar perfil</Text>
              <ChevronRight size={20} color={colores.primary} />
            </View>
          </TouchableOpacity>
          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>Apariencia</Text>
            
            <Card style={styles.opcionCard}>
              <TouchableOpacity onPress={toggleTema} style={styles.opcion}>
                <View style={styles.opcionLeft}>
                  {isDark ? (
                    <Moon size={24} color={colores.primary} />
                  ) : (
                    <Sun size={24} color={colores.primary} />
                  )}
                  <View style={styles.opcionTextos}>
                    <Text style={styles.opcionTitulo}>Tema</Text>
                    <Text style={styles.opcionDescripcion}>
                      {isDark ? 'Oscuro' : 'Claro'}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={toggleTema}
                  trackColor={{ false: colores.border, true: colores.primary }}
                  thumbColor="#FFFFFF"
                />
              </TouchableOpacity>
            </Card>
          </View>

          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>Notificaciones</Text>
            
            <Card style={styles.opcionCard}>
              <View style={styles.opcion}>
                <View style={styles.opcionLeft}>
                  <Bell size={24} color={colores.primary} />
                  <View style={styles.opcionTextos}>
                    <Text style={styles.opcionTitulo}>Notificaciones</Text>
                    <Text style={styles.opcionDescripcion}>
                      Recibir recordatorios de eventos
                    </Text>
                  </View>
                </View>
                <Switch
                  value={ajustes.notificacionesHabilitadas}
                  onValueChange={toggleNotificaciones}
                  trackColor={{ false: colores.border, true: colores.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </Card>

            <Card style={styles.opcionCard}>
              <View style={styles.opcion}>
                <View style={styles.opcionLeft}>
                  <Bell size={24} color={colores.primary} />
                  <View style={styles.opcionTextos}>
                    <Text style={styles.opcionTitulo}>Vibración</Text>
                    <Text style={styles.opcionDescripcion}>
                      Vibrar al recibir notificaciones
                    </Text>
                  </View>
                </View>
                <Switch
                  value={ajustes.vibracionHabilitada}
                  onValueChange={toggleVibracion}
                  trackColor={{ false: colores.border, true: colores.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </Card>
          </View>

          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>Social</Text>
            
            <Card style={styles.opcionCard}>
              <TouchableOpacity 
                onPress={() => router.push('/notificaciones' as any)}
                style={styles.opcion}
              >
                <View style={styles.opcionLeft}>
                  <BellDot size={24} color={colores.primary} />
                  <View style={styles.opcionTextos}>
                    <Text style={styles.opcionTitulo}>Notificaciones</Text>
                    <Text style={styles.opcionDescripcion}>
                      {solicitudesPendientes.length > 0 
                        ? `${solicitudesPendientes.length} solicitud${solicitudesPendientes.length > 1 ? 'es' : ''} pendiente${solicitudesPendientes.length > 1 ? 's' : ''}`
                        : 'Sin notificaciones nuevas'
                      }
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={colores.textSecondary} />
              </TouchableOpacity>
            </Card>
          </View>

          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>Privacidad</Text>
            
            <Card style={styles.opcionCard}>
              <View style={styles.opcion}>
                <View style={styles.opcionLeft}>
                  <UsersIcon size={24} color={colores.primary} />
                  <View style={styles.opcionTextos}>
                    <Text style={styles.opcionTitulo}>Eventos públicos</Text>
                    <Text style={styles.opcionDescripcion}>
                      Permitir que tus amigos vean tus eventos
                    </Text>
                  </View>
                </View>
                <Switch
                  value={usuario?.eventosPublicos || false}
                  onValueChange={toggleEventosPublicos}
                  trackColor={{ false: colores.border, true: colores.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </Card>
          </View>

          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>Acerca de</Text>
            
            <Card style={styles.opcionCard}>
              <View style={styles.opcion}>
                <View style={styles.opcionLeft}>
                  <Info size={24} color={colores.primary} />
                  <View style={styles.opcionTextos}>
                    <Text style={styles.opcionTitulo}>MyPlanU</Text>
                    <Text style={styles.opcionDescripcion}>
                      Versión 1.0.0
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          </View>

          <View style={{ paddingHorizontal: 16, gap: 12 }}>
            <Button
              title="Cerrar Sesión"
              onPress={handleCerrarSesion}
              variant="outline"
              size="large"
            />
            <Button
              title="Eliminar Cuenta"
              onPress={handleEliminarCuenta}
              variant="outline"
              size="large"
              style={{ borderColor: '#FF3B30', marginBottom: 8 }}
              textStyle={{ color: '#FF3B30', fontWeight: '700' as const }}
            />
          </View>

          <Text style={styles.version}>
            © 2025 MyPlanU. Todos los derechos reservados.
          </Text>
        </ScrollView>
      </View>
    </>
  );
}
