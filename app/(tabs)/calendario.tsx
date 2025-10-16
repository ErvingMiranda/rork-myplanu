import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react-native';
import { BORDES, SOMBRAS } from '@/constants/theme';
import { useTema } from '@/hooks/useTema';
import { useEventos } from '@/hooks/useEventos';
import { Card } from '@/components/Card';
import { GradientHeader, useGradientHeaderOverlap } from '@/components/GradientHeader';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

const { width } = Dimensions.get('window');
const dayWidth = (width - 64) / 7;

export default function CalendarioScreen() {
  const { colores } = useTema();
  const { obtenerPorDia } = useEventos();
  const router = useRouter();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [mesActual, setMesActual] = useState(new Date());
  const CALENDAR_OVERLAP = 20;
  const overlapStyle = useGradientHeaderOverlap(CALENDAR_OVERLAP);

  const dias = eachDayOfInterval({
    start: startOfMonth(mesActual),
    end: endOfMonth(mesActual),
  });

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const eventosDelDia = obtenerPorDia(fechaSeleccionada);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colores.surface,
    },
    calendarCard: {
      ...overlapStyle,
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: colores.card,
      borderRadius: BORDES.card,
      padding: 16,
      ...SOMBRAS.media,
      position: 'relative' as const,
      zIndex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    mesTexto: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colores.text,
    },
    navButton: {
      padding: 8,
    },
    diasSemanaContainer: {
      flexDirection: 'row',
      paddingHorizontal: 0,
      paddingVertical: 12,
      backgroundColor: colores.surface,
    },
    diaSemana: {
      width: dayWidth,
      alignItems: 'center',
    },
    diaSemanaTexto: {
      fontSize: 12,
      fontWeight: '600' as const,
      color: colores.textSecondary,
    },
    diasContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 0,
      paddingTop: 8,
      backgroundColor: colores.surface,
    },
    diaContainer: {
      width: dayWidth,
      height: dayWidth,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    dia: {
      width: dayWidth - 8,
      height: dayWidth - 8,
      borderRadius: (dayWidth - 8) / 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    diaTexto: {
      fontSize: 14,
      fontWeight: '500' as const,
    },
    diaSeleccionado: {
      backgroundColor: colores.primary,
    },
    diaHoy: {
      borderWidth: 2,
      borderColor: colores.primary,
    },
    diaOtroMes: {
      opacity: 0.3,
    },
    diaConEventos: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colores.primary,
      position: 'absolute' as const,
      bottom: 4,
    },
    eventosContainer: {
      flex: 1,
      padding: 16,
    },
    eventosHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    eventosTitulo: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colores.text,
    },
    eventoCard: {
      marginBottom: 12,
      padding: 16,
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
      color: colores.textSecondary,
    },
    eventoCurso: {
      fontSize: 14,
      color: colores.textSecondary,
      marginTop: 4,
    },
    emptyText: {
      fontSize: 14,
      color: colores.textSecondary,
      textAlign: 'center',
      marginTop: 32,
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
  });

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Calendario',
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        <GradientHeader
          title="Calendario"
          subtitle={format(mesActual, 'MMMM yyyy', { locale: es })}
          startColor={colores.gradientStart}
          endColor={colores.gradientEnd}
          overlap={CALENDAR_OVERLAP}
          leftIcon={
            <View style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <CalendarIcon size={28} color="#FFFFFF" />
            </View>
          }
        />

        <ScrollView style={{ backgroundColor: colores.surface }}>
          <View style={styles.calendarCard}>
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.navButton} 
                onPress={() => setMesActual(subMonths(mesActual, 1))}
              >
                <ChevronLeft size={24} color={colores.text} />
              </TouchableOpacity>
              
              <Text style={styles.mesTexto}>
                {format(mesActual, 'MMMM yyyy', { locale: es })}
              </Text>
              
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => setMesActual(addMonths(mesActual, 1))}
              >
                <ChevronRight size={24} color={colores.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.diasSemanaContainer}>
              {diasSemana.map((dia) => (
                <View key={dia} style={styles.diaSemana}>
                  <Text style={styles.diaSemanaTexto}>{dia}</Text>
                </View>
              ))}
            </View>

            <View style={styles.diasContainer}>
            {dias.map((dia) => {
              const esHoy = isSameDay(dia, new Date());
              const esSeleccionado = isSameDay(dia, fechaSeleccionada);
              const esMesActual = isSameMonth(dia, mesActual);
              const tieneEventos = obtenerPorDia(dia).length > 0;

              return (
                <View key={dia.toISOString()} style={styles.diaContainer}>
                  <TouchableOpacity
                    onPress={() => setFechaSeleccionada(dia)}
                    style={[
                      styles.dia,
                      esHoy && styles.diaHoy,
                      esSeleccionado && styles.diaSeleccionado,
                      !esMesActual && styles.diaOtroMes,
                    ]}
                  >
                    <Text
                      style={[
                        styles.diaTexto,
                        { color: esSeleccionado ? colores.surface : colores.text },
                      ]}
                    >
                      {format(dia, 'd')}
                    </Text>
                    {tieneEventos && !esSeleccionado && (
                      <View style={styles.diaConEventos} />
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
            </View>
          </View>

          <View style={styles.eventosContainer}>
            <View style={styles.eventosHeader}>
              <Text style={styles.eventosTitulo}>
                {format(fechaSeleccionada, "d 'de' MMMM", { locale: es })}
              </Text>
            </View>

            {eventosDelDia.length === 0 ? (
              <Text style={styles.emptyText}>No hay eventos para este día</Text>
            ) : (
              eventosDelDia.map((evento) => (
                <Card 
                  key={evento.id} 
                  style={[styles.eventoCard, { borderLeftWidth: 4, borderLeftColor: evento.color }]}
                  onPress={() => router.push(`/evento/${evento.id}` as any)}
                >
                  <View style={styles.eventoHeader}>
                    <Text style={styles.eventoTitulo}>{evento.titulo}</Text>
                    <Text style={styles.eventoHora}>
                      {format(new Date(evento.fechaInicio), 'HH:mm')}
                    </Text>
                  </View>
                  {evento.curso && (
                    <Text style={styles.eventoCurso}>{evento.curso}</Text>
                  )}
                </Card>
              ))
            )}
          </View>
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
