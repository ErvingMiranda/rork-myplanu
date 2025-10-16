import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTema } from '@/hooks/useTema';
import { useEventos } from '@/hooks/useEventos';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { COLORES_EVENTO, DIAS_SEMANA } from '@/constants/theme';
import type { EventoCrear } from '@/types';

export default function CrearEventoScreen() {
  const { colores } = useTema();
  const { crear } = useEventos();
  const router = useRouter();

  const [titulo, setTitulo] = useState('');
  const [curso, setCurso] = useState('');
  const [aula, setAula] = useState('');
  const [docente, setDocente] = useState('');
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(new Date());
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [horaFin, setHoraFin] = useState('10:00');
  const [fechaFinRecurrencia, setFechaFinRecurrencia] = useState<Date | null>(null);
  const [mostrarFechaFinRecurrencia, setMostrarFechaFinRecurrencia] = useState(false);
  const [colorSeleccionado, setColorSeleccionado] = useState(COLORES_EVENTO[0]);
  const [esRecurrente, setEsRecurrente] = useState(false);
  const [diasSeleccionados, setDiasSeleccionados] = useState<number[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const fechaFinTemp = new Date(fechaInicio);
    const [horaF, minF] = horaFin.split(':').map(Number);
    fechaFinTemp.setHours(horaF, minF, 0, 0);
    setFechaFin(fechaFinTemp);
  }, [fechaInicio, horaFin]);

  const handleGuardar = async () => {
    if (!titulo.trim()) {
      Alert.alert('Error', 'El título es requerido');
      return;
    }

    const [horaI, minI] = horaInicio.split(':').map(Number);
    const [horaF, minF] = horaFin.split(':').map(Number);

    const fechaInicioFinal = new Date(fechaInicio);
    fechaInicioFinal.setHours(horaI, minI, 0, 0);

    const fechaFinFinal = new Date(fechaFin);
    fechaFinFinal.setHours(horaF, minF, 0, 0);

    if (fechaFinFinal <= fechaInicioFinal) {
      Alert.alert('Error', 'La fecha/hora de fin debe ser posterior a la de inicio');
      return;
    }

    if (esRecurrente && !fechaFinRecurrencia) {
      Alert.alert('Error', 'Debes especificar hasta cuándo se repetirá el evento');
      return;
    }

    const nuevoEvento: EventoCrear = {
      titulo: titulo.trim(),
      curso: curso.trim() || undefined,
      aula: aula.trim() || undefined,
      docente: docente.trim() || undefined,
      fechaInicio: fechaInicioFinal.toISOString(),
      fechaFin: fechaFinFinal.toISOString(),
      color: colorSeleccionado.valor,
      esRecurrente,
      diasSemana: esRecurrente && diasSeleccionados.length > 0 ? diasSeleccionados : undefined,
      fechaFinRecurrencia: fechaFinRecurrencia?.toISOString(),
      recordatorios: [15],
      esCompartido: false,
    };

    setCargando(true);
    try {
      await crear(nuevoEvento);
      Alert.alert('Éxito', 'Evento creado correctamente', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al crear evento');
    } finally {
      setCargando(false);
    }
  };

  const toggleDia = (dia: number) => {
    setDiasSeleccionados(prev =>
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    );
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
    seccionTitulo: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: colores.text,
      marginBottom: 12,
    },
    coloresContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    colorButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: 'transparent',
    },
    colorButtonSeleccionado: {
      borderColor: colores.primary,
    },
    colorInner: {
      width: 36,
      height: 36,
      borderRadius: 18,
    },
    diasContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    diaButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colores.border,
      backgroundColor: colores.card,
    },
    diaButtonSeleccionado: {
      backgroundColor: colores.primary,
      borderColor: colores.primary,
    },
    diaTexto: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colores.text,
    },
    diaTextoSeleccionado: {
      color: '#FFFFFF',
    },
    recurrenteContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: colores.card,
      borderRadius: 12,
      marginBottom: 16,
    },
    recurrenteTexto: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colores.text,
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
      paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    },
    fechaButton: {
      padding: 16,
      backgroundColor: colores.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colores.border,
      marginTop: 4,
    },
    fechaTexto: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colores.text,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.seccion}>
          <Input
            label="Título del evento *"
            placeholder="Ej: Clase de Matemáticas"
            value={titulo}
            onChangeText={setTitulo}
          />

          <Input
            label="Curso"
            placeholder="Ej: MAT101"
            value={curso}
            onChangeText={setCurso}
          />

          <Input
            label="Aula"
            placeholder="Ej: Aula 305"
            value={aula}
            onChangeText={setAula}
          />

          <Input
            label="Docente"
            placeholder="Ej: Dr. García"
            value={docente}
            onChangeText={setDocente}
          />
        </View>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Fechas</Text>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={[styles.seccionTitulo, { fontSize: 14, marginBottom: 8 }]}>Fecha inicio</Text>
            <TouchableOpacity 
              style={styles.fechaButton}
              onPress={() => {
                Alert.alert('Info', 'Selector de fecha próximamente. Por ahora usa la fecha actual.');
              }}
            >
              <Text style={styles.fechaTexto}>{fechaInicio.toLocaleDateString('es-ES')}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={[styles.seccionTitulo, { fontSize: 14, marginBottom: 8 }]}>Fecha fin (si dura varios días)</Text>
            <TouchableOpacity 
              style={styles.fechaButton}
              onPress={() => {
                Alert.alert('Info', 'Selector de fecha próximamente.');
              }}
            >
              <Text style={styles.fechaTexto}>{fechaFin.toLocaleDateString('es-ES')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <Input
              label="Hora inicio"
              placeholder="09:00"
              value={horaInicio}
              onChangeText={setHoraInicio}
              containerStyle={{ flex: 1, marginBottom: 0 }}
            />
            <Input
              label="Hora fin"
              placeholder="10:00"
              value={horaFin}
              onChangeText={setHoraFin}
              containerStyle={{ flex: 1, marginBottom: 0 }}
            />
          </View>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Color</Text>
          <View style={styles.coloresContainer}>
            {COLORES_EVENTO.map((color) => (
              <TouchableOpacity
                key={color.id}
                onPress={() => setColorSeleccionado(color)}
                style={[
                  styles.colorButton,
                  colorSeleccionado.id === color.id && styles.colorButtonSeleccionado
                ]}
              >
                <View style={[styles.colorInner, { backgroundColor: color.valor }]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.seccion}>
          <TouchableOpacity
            style={styles.recurrenteContainer}
            onPress={() => setEsRecurrente(!esRecurrente)}
          >
            <Text style={styles.recurrenteTexto}>Repetir semanalmente</Text>
            <View style={{ 
              width: 24, 
              height: 24, 
              borderRadius: 12, 
              backgroundColor: esRecurrente ? colores.primary : colores.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {esRecurrente && (
                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFFFFF' }} />
              )}
            </View>
          </TouchableOpacity>

          {esRecurrente && (
            <>
              <Text style={styles.seccionTitulo}>Días de la semana</Text>
              <View style={styles.diasContainer}>
                {DIAS_SEMANA.map((dia) => (
                  <TouchableOpacity
                    key={dia.id}
                    onPress={() => toggleDia(dia.id)}
                    style={[
                      styles.diaButton,
                      diasSeleccionados.includes(dia.id) && styles.diaButtonSeleccionado
                    ]}
                  >
                    <Text style={[
                      styles.diaTexto,
                      diasSeleccionados.includes(dia.id) && styles.diaTextoSeleccionado
                    ]}>
                      {dia.corto}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ marginTop: 16 }}>
                <TouchableOpacity
                  style={styles.recurrenteContainer}
                  onPress={() => setMostrarFechaFinRecurrencia(!mostrarFechaFinRecurrencia)}
                >
                  <Text style={styles.recurrenteTexto}>Hasta cuándo repetir *</Text>
                  <View style={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: 12, 
                    backgroundColor: mostrarFechaFinRecurrencia ? colores.primary : colores.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {mostrarFechaFinRecurrencia && (
                      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFFFFF' }} />
                    )}
                  </View>
                </TouchableOpacity>

                {mostrarFechaFinRecurrencia && (
                  <TouchableOpacity 
                    style={styles.fechaButton}
                    onPress={() => {
                      const fechaTemp = new Date();
                      fechaTemp.setMonth(fechaTemp.getMonth() + 3);
                      setFechaFinRecurrencia(fechaTemp);
                    }}
                  >
                    <Text style={styles.fechaTexto}>
                      {fechaFinRecurrencia ? fechaFinRecurrencia.toLocaleDateString('es-ES') : 'Seleccionar fecha'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
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
            title="Guardar"
            onPress={handleGuardar}
            loading={cargando}
            variant="gradient"
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
