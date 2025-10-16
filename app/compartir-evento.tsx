import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTema } from '@/hooks/useTema';
import { useEventos } from '@/hooks/useEventos';
import { useAmigos } from '@/hooks/useAmigos';
import { Button } from '@/components/Button';
import { SolicitudEventoRepository } from '@/data/repositories/solicitudEventoRepository';
import { Check } from 'lucide-react-native';

const solicitudEventoRepo = new SolicitudEventoRepository();

export default function CompartirEventoScreen() {
  const { colores } = useTema();
  const router = useRouter();
  const { eventoId } = useLocalSearchParams();
  const { eventos } = useEventos();
  const { amigos } = useAmigos();
  
  const [amigosSeleccionados, setAmigosSeleccionados] = useState<string[]>([]);
  const [cargando, setCargando] = useState(false);

  const evento = eventos.find(e => e.id === eventoId);

  useEffect(() => {
    if (!evento) {
      Alert.alert('Error', 'Evento no encontrado', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  }, [evento]);

  const toggleAmigo = (amigoId: string) => {
    setAmigosSeleccionados(prev =>
      prev.includes(amigoId) 
        ? prev.filter(id => id !== amigoId)
        : [...prev, amigoId]
    );
  };

  const handleCompartir = async () => {
    if (amigosSeleccionados.length === 0) {
      Alert.alert('Info', 'Selecciona al menos un amigo para compartir');
      return;
    }

    if (!evento) return;

    setCargando(true);
    try {
      const promesas = amigosSeleccionados.map(amigoId =>
        solicitudEventoRepo.crear(evento.id, evento.userId, amigoId)
      );

      await Promise.all(promesas);

      Alert.alert(
        'Éxito',
        `Solicitud enviada a ${amigosSeleccionados.length} amigo${amigosSeleccionados.length > 1 ? 's' : ''}`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al compartir evento');
    } finally {
      setCargando(false);
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
    seccion: {
      marginBottom: 24,
    },
    titulo: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: colores.text,
      marginBottom: 8,
    },
    subtitulo: {
      fontSize: 16,
      color: colores.textSecondary,
      marginBottom: 24,
    },
    seccionTitulo: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: colores.text,
      marginBottom: 12,
    },
    amigoCard: {
      backgroundColor: colores.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    amigoCardSeleccionado: {
      borderColor: colores.primary,
      backgroundColor: `${colores.primary}15`,
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
    checkContainer: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: colores.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkContainerSeleccionado: {
      backgroundColor: colores.primary,
      borderColor: colores.primary,
    },
    eventoInfo: {
      backgroundColor: colores.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
      borderLeftWidth: 4,
      borderLeftColor: colores.primary,
    },
    eventoTitulo: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colores.text,
      marginBottom: 8,
    },
    eventoDetalle: {
      fontSize: 14,
      color: colores.textSecondary,
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
      paddingBottom: 32,
    },
    vacio: {
      alignItems: 'center',
      paddingVertical: 32,
    },
    vacioTexto: {
      fontSize: 16,
      color: colores.textSecondary,
      textAlign: 'center',
    },
  });

  if (!evento) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.seccion}>
          <Text style={styles.titulo}>Compartir evento</Text>
          <Text style={styles.subtitulo}>
            Selecciona los amigos con quienes compartir esta meta
          </Text>
        </View>

        <View style={styles.eventoInfo}>
          <Text style={styles.eventoTitulo}>{evento.titulo}</Text>
          {evento.curso && (
            <Text style={styles.eventoDetalle}>Curso: {evento.curso}</Text>
          )}
          <Text style={styles.eventoDetalle}>
            {new Date(evento.fechaInicio).toLocaleDateString('es-ES')}
          </Text>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Seleccionar amigos</Text>
          
          {amigos.length === 0 ? (
            <View style={styles.vacio}>
              <Text style={styles.vacioTexto}>
                Aún no tienes amigos para compartir eventos.{'\n'}
                Ve a la pestaña de Amigos para agregar.
              </Text>
            </View>
          ) : (
            amigos.map((amigo) => {
              const inicial = amigo.usuario.nombre 
                ? amigo.usuario.nombre[0].toUpperCase() 
                : amigo.usuario.email[0].toUpperCase();
              const seleccionado = amigosSeleccionados.includes(amigo.usuario.id);

              return (
                <TouchableOpacity
                  key={amigo.id}
                  style={[
                    styles.amigoCard,
                    seleccionado && styles.amigoCardSeleccionado
                  ]}
                  onPress={() => toggleAmigo(amigo.usuario.id)}
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarTexto}>{inicial}</Text>
                  </View>
                  <View style={styles.infoContainer}>
                    <Text style={styles.nombre}>
                      {amigo.usuario.nombre || 'Sin nombre'}
                    </Text>
                    <Text style={styles.email}>{amigo.usuario.email}</Text>
                  </View>
                  <View style={[
                    styles.checkContainer,
                    seleccionado && styles.checkContainerSeleccionado
                  ]}>
                    {seleccionado && <Check size={16} color="#FFFFFF" />}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            title="Cancelar"
            onPress={() => router.back()}
            variant="outline"
            style={{ flex: 1 }}
          />
          <Button
            title={`Compartir (${amigosSeleccionados.length})`}
            onPress={handleCompartir}
            loading={cargando}
            variant="gradient"
            style={{ flex: 1 }}
            disabled={amigosSeleccionados.length === 0}
          />
        </View>
      </ScrollView>
    </View>
  );
}
