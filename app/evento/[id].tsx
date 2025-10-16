import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Clock, MapPin, User, Calendar, Repeat } from 'lucide-react-native';
import { useTema } from '@/hooks/useTema';
import { useEventos } from '@/hooks/useEventos';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Evento } from '@/types';

export default function DetalleEventoScreen() {
  const { colores } = useTema();
  const { eventos, eliminar } = useEventos();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [evento, setEvento] = useState<Evento | null>(null);

  useEffect(() => {
    const eventoEncontrado = eventos.find(e => e.id === id);
    if (eventoEncontrado) {
      setEvento(eventoEncontrado);
    } else {
      Alert.alert('Error', 'Evento no encontrado', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  }, [id, eventos, router]);

  const handleEliminar = () => {
    Alert.alert(
      'Eliminar Evento',
      '¿Estás seguro de que deseas eliminar este evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminar(id as string);
              router.back();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al eliminar evento');
            }
          }
        }
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colores.background,
    },
    loading: {
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    scrollContent: {
      padding: 16,
    },
    headerCard: {
      padding: 20,
      marginBottom: 16,
      borderLeftWidth: 6,
      borderLeftColor: evento?.color || colores.primary,
    },
    titulo: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: colores.text,
      marginBottom: 8,
    },
    hora: {
      fontSize: 16,
      color: colores.textSecondary,
      marginBottom: 4,
    },
    fecha: {
      fontSize: 14,
      color: colores.textSecondary,
    },
    infoCard: {
      padding: 16,
      marginBottom: 12,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12,
    },
    infoLabel: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colores.textSecondary,
      minWidth: 80,
    },
    infoValor: {
      fontSize: 14,
      color: colores.text,
      flex: 1,
    },
    buttonsContainer: {
      marginTop: 16,
      gap: 12,
    },
  });

  if (!evento) {
    return (
      <View style={[styles.container, styles.loading]}>
        <Text style={{ color: colores.textSecondary }}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.headerCard}>
          <Text style={styles.titulo}>{evento.titulo}</Text>
          <Text style={styles.hora}>
            {format(new Date(evento.fechaInicio), 'HH:mm')} - {format(new Date(evento.fechaFin), 'HH:mm')}
          </Text>
          <Text style={styles.fecha}>
            {format(new Date(evento.fechaInicio), "EEEE, d 'de' MMMM", { locale: es })}
          </Text>
        </Card>

        <Card style={styles.infoCard}>
          {evento.curso && (
            <View style={styles.infoRow}>
              <Calendar size={20} color={colores.primary} />
              <Text style={styles.infoLabel}>Curso:</Text>
              <Text style={styles.infoValor}>{evento.curso}</Text>
            </View>
          )}

          {evento.aula && (
            <View style={styles.infoRow}>
              <MapPin size={20} color={colores.primary} />
              <Text style={styles.infoLabel}>Aula:</Text>
              <Text style={styles.infoValor}>{evento.aula}</Text>
            </View>
          )}

          {evento.docente && (
            <View style={styles.infoRow}>
              <User size={20} color={colores.primary} />
              <Text style={styles.infoLabel}>Docente:</Text>
              <Text style={styles.infoValor}>{evento.docente}</Text>
            </View>
          )}

          {evento.esRecurrente && (
            <View style={styles.infoRow}>
              <Repeat size={20} color={colores.primary} />
              <Text style={styles.infoLabel}>Repetición:</Text>
              <Text style={styles.infoValor}>Semanal</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Clock size={20} color={colores.primary} />
            <Text style={styles.infoLabel}>Recordatorio:</Text>
            <Text style={styles.infoValor}>
              {evento.recordatorios.length > 0 
                ? `${evento.recordatorios[0]} minutos antes`
                : 'Sin recordatorio'
              }
            </Text>
          </View>
        </Card>

        {evento.notas && (
          <Card style={styles.infoCard}>
            <Text style={[styles.infoLabel, { marginBottom: 8 }]}>Notas:</Text>
            <Text style={styles.infoValor}>{evento.notas}</Text>
          </Card>
        )}

        <View style={styles.buttonsContainer}>
          <Button
            title="Eliminar Evento"
            onPress={handleEliminar}
            variant="outline"
          />
        </View>
      </ScrollView>
    </View>
  );
}
