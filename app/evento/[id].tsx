import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MapPin, User, Calendar, Repeat, Tag, CheckSquare, Square, Bell } from 'lucide-react-native';
import { useTema } from '@/hooks/useTema';
import { useEventos } from '@/hooks/useEventos';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Evento, ChecklistItem } from '@/types';

export default function DetalleEventoScreen() {
  const { colores } = useTema();
  const { eventos, eliminar, actualizar } = useEventos();
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

  const toggleChecklistItem = async (itemId: string) => {
    if (!evento || !evento.checklist) return;
    
    const nuevoChecklist = evento.checklist.map(item => 
      item.id === itemId ? { ...item, completado: !item.completado } : item
    );
    
    try {
      await actualizar(evento.id, { checklist: nuevoChecklist });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al actualizar checklist');
    }
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
    seccionTitulo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
    },
    seccionTituloTexto: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: colores.text,
    },
    checklistItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colores.border,
    },
    checklistItemTexto: {
      fontSize: 14,
      color: colores.text,
      flex: 1,
    },
    checklistItemCompletado: {
      textDecorationLine: 'line-through',
      color: colores.textSecondary,
    },
    etiquetasContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 4,
    },
    etiquetaChip: {
      paddingVertical: 4,
      paddingHorizontal: 12,
      backgroundColor: colores.primary,
      borderRadius: 12,
    },
    etiquetaTexto: {
      fontSize: 12,
      fontWeight: '600' as const,
      color: '#FFFFFF',
    },
    recordatorioItem: {
      paddingVertical: 6,
      paddingLeft: 20,
    },
    recordatorioTexto: {
      fontSize: 14,
      color: colores.text,
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
            {format(new Date(evento.fechaInicio), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
            {new Date(evento.fechaInicio).toDateString() !== new Date(evento.fechaFin).toDateString() && (
              <Text> hasta {format(new Date(evento.fechaFin), "d 'de' MMMM", { locale: es })}</Text>
            )}
          </Text>
        </Card>

        <Card style={styles.infoCard}>
          {evento.curso && (
            <View style={styles.infoRow}>
              <Calendar size={20} color={colores.primary} />
              <Text style={styles.infoLabel}>Tipo:</Text>
              <Text style={styles.infoValor}>{evento.curso}</Text>
            </View>
          )}

          {evento.aula && (
            <View style={styles.infoRow}>
              <MapPin size={20} color={colores.primary} />
              <Text style={styles.infoLabel}>Lugar:</Text>
              <Text style={styles.infoValor}>{evento.aula}</Text>
            </View>
          )}

          {evento.docente && (
            <View style={styles.infoRow}>
              <User size={20} color={colores.primary} />
              <Text style={styles.infoLabel}>Organizador:</Text>
              <Text style={styles.infoValor}>{evento.docente}</Text>
            </View>
          )}

          {evento.esRecurrente && (
            <View style={styles.infoRow}>
              <Repeat size={20} color={colores.primary} />
              <Text style={styles.infoLabel}>Repetición:</Text>
              <Text style={styles.infoValor}>
                Semanal{evento.fechaFinRecurrencia ? ` hasta ${format(new Date(evento.fechaFinRecurrencia), "d 'de' MMMM", { locale: es })}` : ''}
              </Text>
            </View>
          )}
        </Card>

        {evento.etiquetas && evento.etiquetas.length > 0 && (
          <Card style={styles.infoCard}>
            <View style={styles.seccionTitulo}>
              <Tag size={20} color={colores.primary} />
              <Text style={styles.seccionTituloTexto}>Etiquetas</Text>
            </View>
            <View style={styles.etiquetasContainer}>
              {evento.etiquetas.map((etiqueta) => (
                <View key={etiqueta} style={styles.etiquetaChip}>
                  <Text style={styles.etiquetaTexto}>{etiqueta}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {evento.recordatorios && evento.recordatorios.length > 0 && (
          <Card style={styles.infoCard}>
            <View style={styles.seccionTitulo}>
              <Bell size={20} color={colores.primary} />
              <Text style={styles.seccionTituloTexto}>Recordatorios</Text>
            </View>
            {evento.recordatorios.map((rec) => (
              <View key={rec.id} style={styles.recordatorioItem}>
                <Text style={styles.recordatorioTexto}>• {rec.etiqueta}</Text>
              </View>
            ))}
          </Card>
        )}

        {evento.checklist && evento.checklist.length > 0 && (
          <Card style={styles.infoCard}>
            <View style={styles.seccionTitulo}>
              <CheckSquare size={20} color={colores.primary} />
              <Text style={styles.seccionTituloTexto}>Checklist</Text>
            </View>
            {evento.checklist.map((item: ChecklistItem) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.checklistItem}
                onPress={() => toggleChecklistItem(item.id)}
              >
                {item.completado ? (
                  <CheckSquare size={20} color={colores.primary} />
                ) : (
                  <Square size={20} color={colores.textSecondary} />
                )}
                <Text style={[
                  styles.checklistItemTexto,
                  item.completado && styles.checklistItemCompletado
                ]}>
                  {item.texto}
                </Text>
              </TouchableOpacity>
            ))}
          </Card>
        )}

        {evento.notas && (
          <Card style={styles.infoCard}>
            <Text style={[styles.infoLabel, { marginBottom: 8 }]}>Notas:</Text>
            <Text style={styles.infoValor}>{evento.notas}</Text>
          </Card>
        )}

        <View style={styles.buttonsContainer}>
          <Button
            title="Compartir con amigos"
            onPress={() => router.push(`/compartir-evento?eventoId=${evento.id}`)}
            variant="gradient"
          />
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
