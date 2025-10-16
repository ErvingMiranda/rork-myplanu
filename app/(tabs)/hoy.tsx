import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Plus, Clock, User, Users as UsersIcon } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { BORDES, SOMBRAS } from '@/constants/theme';
import { useTema } from '@/hooks/useTema';
import { useEventos } from '@/hooks/useEventos';
import { useEventosAmigos } from '@/hooks/useEventosAmigos';
import { Card } from '@/components/Card';
import { GradientHeader, useGradientHeaderOverlap } from '@/components/GradientHeader';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function HoyScreen() {
  const { colores } = useTema();
  const { obtenerEventosHoy } = useEventos();
  const { usuario } = useAuth();
  const router = useRouter();
  const { eventosAmigos } = useEventosAmigos();
  const [mostrarEventosAmigos, setMostrarEventosAmigos] = useState(false);
  const TODAY_OVERLAP = 0;
  const overlapStyle = useGradientHeaderOverlap(TODAY_OVERLAP);

  const eventosHoy = obtenerEventosHoy();
  const ahora = new Date();

  const eventosProximos = eventosHoy.filter(e => new Date(e.fechaInicio) > ahora);
  const eventosPasados = eventosHoy.filter(e => new Date(e.fechaFin) <= ahora);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colores.surface,
    },
    tarjetaUsuario: {
      ...overlapStyle,
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: colores.card,
      borderRadius: BORDES.card,
      padding: 20,
      ...SOMBRAS.media,
      position: 'relative' as const,
      zIndex: 1,
    },
    tarjetaUsuarioHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      marginBottom: 16,
    },
    avatarGrande: {
      width: 64,
      height: 64,
      borderRadius: BORDES.redondo,
      backgroundColor: colores.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tarjetaUsuarioInfo: {
      flex: 1,
    },
    tarjetaUsuarioNombre: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colores.text,
      marginBottom: 4,
    },
    tarjetaUsuarioEmail: {
      fontSize: 14,
      color: colores.textSecondary,
    },
    tarjetaUsuarioFecha: {
      fontSize: 14,
      color: colores.textSecondary,
      textAlign: 'center',
    },
    scrollContent: {
      paddingTop: 24,
    },
    seccion: {
      marginBottom: 24,
      paddingHorizontal: 16,
    },
    seccionTitulo: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colores.text,
      marginBottom: 16,
    },
    eventoCard: {
      marginBottom: 12,
      padding: 16,
      borderLeftWidth: 4,
    },
    eventoHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    eventoTitulo: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colores.text,
      flex: 1,
    },
    eventoHora: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colores.primary,
    },
    eventoInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 4,
    },
    eventoInfoTexto: {
      fontSize: 14,
      color: colores.textSecondary,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 48,
    },
    emptyText: {
      fontSize: 16,
      color: colores.textSecondary,
      textAlign: 'center',
      marginBottom: 16,
    },
    fab: {
      position: 'absolute' as const,
      bottom: 24,
      right: 24,
      width: 64,
      height: 64,
      borderRadius: BORDES.redondo,
      backgroundColor: colores.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...SOMBRAS.fuerte,
    },
    toggleContainer: {
      flexDirection: 'row',
      gap: 8,
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    toggleButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colores.border,
      backgroundColor: colores.card,
      alignItems: 'center',
    },
    toggleButtonActivo: {
      backgroundColor: colores.primary,
      borderColor: colores.primary,
    },
    toggleTexto: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colores.text,
    },
    toggleTextoActivo: {
      color: '#FFFFFF',
    },
    eventoAmigoCard: {
      marginBottom: 12,
      padding: 16,
      borderLeftWidth: 4,
      backgroundColor: `${colores.primary}08`,
    },
    amigoInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colores.border,
    },
    amigoAvatar: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colores.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    amigoAvatarTexto: {
      fontSize: 12,
      fontWeight: '700' as const,
      color: '#FFFFFF',
    },
    amigoNombre: {
      fontSize: 13,
      fontWeight: '600' as const,
      color: colores.textSecondary,
    },
  });

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Hoy',
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        <GradientHeader
          title="Hoy"
          subtitle={`Hola ${usuario?.nombre || 'Usuario'}, ¡Bienvenido!`}
          startColor={colores.gradientStart}
          endColor={colores.gradientEnd}
          overlap={TODAY_OVERLAP}
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

        <View style={styles.tarjetaUsuario}>
          <View style={styles.tarjetaUsuarioHeader}>
            <View style={styles.avatarGrande}>
              <User size={32} color="#FFFFFF" />
            </View>
            <View style={styles.tarjetaUsuarioInfo}>
              <Text style={styles.tarjetaUsuarioNombre}>
                {usuario?.nombre || 'Usuario'}
              </Text>
              <Text style={styles.tarjetaUsuarioEmail}>
                {usuario?.email || ''}
              </Text>
            </View>
          </View>
          <Text style={styles.tarjetaUsuarioFecha}>
            {format(ahora, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
          </Text>
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, !mostrarEventosAmigos && styles.toggleButtonActivo]}
            onPress={() => setMostrarEventosAmigos(false)}
          >
            <Text style={[styles.toggleTexto, !mostrarEventosAmigos && styles.toggleTextoActivo]}>
              Mis eventos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, mostrarEventosAmigos && styles.toggleButtonActivo]}
            onPress={() => setMostrarEventosAmigos(true)}
          >
            <Text style={[styles.toggleTexto, mostrarEventosAmigos && styles.toggleTextoActivo]}>
              Eventos de amigos ({eventosAmigos.length})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {!mostrarEventosAmigos ? (
            eventosHoy.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No tienes eventos para hoy.{'\n'}¡Disfruta tu día libre!
              </Text>
            </View>
          ) : (
            <>
              {eventosProximos.length > 0 && (
                <View style={styles.seccion}>
                  <Text style={styles.seccionTitulo}>Próximos eventos</Text>
                  {eventosProximos.map((evento) => (
                    <Card 
                      key={evento.id} 
                      style={[styles.eventoCard, { borderLeftColor: evento.color }]}
                      onPress={() => router.push(`/evento/${evento.id}` as any)}
                    >
                      <View style={styles.eventoHeader}>
                        <Text style={styles.eventoTitulo}>{evento.titulo}</Text>
                        <Text style={styles.eventoHora}>
                          {format(new Date(evento.fechaInicio), 'HH:mm')}
                        </Text>
                      </View>
                      {evento.curso && (
                        <View style={styles.eventoInfo}>
                          <Clock size={14} color={colores.textSecondary} />
                          <Text style={styles.eventoInfoTexto}>{evento.curso}</Text>
                        </View>
                      )}
                    </Card>
                  ))}
                </View>
              )}

              {eventosPasados.length > 0 && (
                <View style={styles.seccion}>
                  <Text style={styles.seccionTitulo}>Eventos pasados</Text>
                  {eventosPasados.map((evento) => (
                    <Card 
                      key={evento.id} 
                      style={[styles.eventoCard, { opacity: 0.6, borderLeftColor: evento.color }]}
                      onPress={() => router.push(`/evento/${evento.id}` as any)}
                    >
                      <View style={styles.eventoHeader}>
                        <Text style={styles.eventoTitulo}>{evento.titulo}</Text>
                        <Text style={styles.eventoHora}>
                          {format(new Date(evento.fechaInicio), 'HH:mm')}
                        </Text>
                      </View>
                    </Card>
                  ))}
                </View>
              )}
            </>
          )
          ) : (
            eventosAmigos.length === 0 ? (
              <View style={styles.emptyContainer}>
                <UsersIcon size={48} color={colores.textSecondary} />
                <Text style={styles.emptyText}>
                  Tus amigos no tienen eventos públicos hoy.
                </Text>
              </View>
            ) : (
              <View style={styles.seccion}>
                <Text style={styles.seccionTitulo}>Eventos de amigos</Text>
                {eventosAmigos.map((evento) => {
                  const inicial = evento.propietario.nombre 
                    ? evento.propietario.nombre[0].toUpperCase()
                    : evento.propietario.email[0].toUpperCase();
                  
                  return (
                    <Card 
                      key={evento.id} 
                      style={[styles.eventoAmigoCard, { borderLeftColor: evento.color }]}
                    >
                      <View style={styles.eventoHeader}>
                        <Text style={styles.eventoTitulo}>{evento.titulo}</Text>
                        <Text style={styles.eventoHora}>
                          {format(new Date(evento.fechaInicio), 'HH:mm')}
                        </Text>
                      </View>
                      {evento.curso && (
                        <View style={styles.eventoInfo}>
                          <Clock size={14} color={colores.textSecondary} />
                          <Text style={styles.eventoInfoTexto}>{evento.curso}</Text>
                        </View>
                      )}
                      <View style={styles.amigoInfo}>
                        <View style={styles.amigoAvatar}>
                          <Text style={styles.amigoAvatarTexto}>{inicial}</Text>
                        </View>
                        <Text style={styles.amigoNombre}>
                          {evento.propietario.nombre || evento.propietario.email}
                        </Text>
                      </View>
                    </Card>
                  );
                })}
              </View>
            )
          )}
        </ScrollView>

        <TouchableOpacity 
          style={styles.fab}
          onPress={() => router.push('/crear-evento' as any)}
        >
          <Plus size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </>
  );
}
