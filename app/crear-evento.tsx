import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  TextInput,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { X, Plus, Check } from 'lucide-react-native';
import { useTema } from '@/hooks/useTema';
import { useEventos } from '@/hooks/useEventos';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { COLORES_EVENTO, DIAS_SEMANA } from '@/constants/theme';
import type { EventoCrear, Recordatorio, ChecklistItem } from '@/types';

const RECORDATORIOS_PREDEF = [
  { tipo: 'minutos' as const, cantidad: 5, etiqueta: '5 minutos antes' },
  { tipo: 'minutos' as const, cantidad: 15, etiqueta: '15 minutos antes' },
  { tipo: 'minutos' as const, cantidad: 30, etiqueta: '30 minutos antes' },
  { tipo: 'horas' as const, cantidad: 1, etiqueta: '1 hora antes' },
  { tipo: 'horas' as const, cantidad: 2, etiqueta: '2 horas antes' },
  { tipo: 'dias' as const, cantidad: 1, etiqueta: '1 día antes' },
];

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
  const [colorSeleccionado, setColorSeleccionado] = useState(COLORES_EVENTO[0]);
  const [esRecurrente, setEsRecurrente] = useState(false);
  const [diasSeleccionados, setDiasSeleccionados] = useState<number[]>([]);
  const [cargando, setCargando] = useState(false);
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'start' | 'end' | 'recurrence'>('start');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerMode, setTimePickerMode] = useState<'start' | 'end'>('start');
  
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([
    { id: '1', tipo: 'minutos', cantidad: 15, etiqueta: '15 minutos antes' }
  ]);
  const [showRecordatoriosModal, setShowRecordatoriosModal] = useState(false);
  
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [nuevoChecklistItem, setNuevoChecklistItem] = useState('');
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  
  const [etiquetas, setEtiquetas] = useState<string[]>([]);
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');
  const [showEtiquetasModal, setShowEtiquetasModal] = useState(false);

  useEffect(() => {
    const fechaFinTemp = new Date(fechaInicio);
    const [horaF, minF] = horaFin.split(':').map(Number);
    fechaFinTemp.setHours(horaF, minF, 0, 0);
    setFechaFin(fechaFinTemp);
  }, [fechaInicio, horaFin]);

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      if (datePickerMode === 'start') {
        setFechaInicio(selectedDate);
      } else if (datePickerMode === 'end') {
        setFechaFin(selectedDate);
      } else if (datePickerMode === 'recurrence') {
        setFechaFinRecurrencia(selectedDate);
      }
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    
    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      
      if (timePickerMode === 'start') {
        setHoraInicio(timeString);
      } else {
        setHoraFin(timeString);
      }
    }
  };

  const abrirDatePicker = (mode: 'start' | 'end' | 'recurrence') => {
    setDatePickerMode(mode);
    setShowDatePicker(true);
  };

  const abrirTimePicker = (mode: 'start' | 'end') => {
    setTimePickerMode(mode);
    setShowTimePicker(true);
  };

  const agregarRecordatorio = (rec: typeof RECORDATORIOS_PREDEF[0]) => {
    const id = `rec_${Date.now()}`;
    setRecordatorios(prev => [...prev, { ...rec, id }]);
    setShowRecordatoriosModal(false);
  };

  const eliminarRecordatorio = (id: string) => {
    setRecordatorios(prev => prev.filter(r => r.id !== id));
  };

  const agregarChecklistItem = () => {
    if (!nuevoChecklistItem.trim()) return;
    
    const id = `check_${Date.now()}`;
    setChecklist(prev => [...prev, {
      id,
      texto: nuevoChecklistItem.trim(),
      completado: false,
      createdAt: new Date().toISOString(),
    }]);
    setNuevoChecklistItem('');
  };

  const eliminarChecklistItem = (id: string) => {
    setChecklist(prev => prev.filter(c => c.id !== id));
  };

  const agregarEtiqueta = () => {
    if (!nuevaEtiqueta.trim()) return;
    if (etiquetas.includes(nuevaEtiqueta.trim())) return;
    
    setEtiquetas(prev => [...prev, nuevaEtiqueta.trim()]);
    setNuevaEtiqueta('');
  };

  const eliminarEtiqueta = (etiqueta: string) => {
    setEtiquetas(prev => prev.filter(e => e !== etiqueta));
  };

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
      recordatorios,
      checklist: checklist.length > 0 ? checklist : undefined,
      etiquetas: etiquetas.length > 0 ? etiquetas : undefined,
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
    listContainer: {
      gap: 8,
      marginTop: 8,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 12,
      backgroundColor: colores.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colores.border,
    },
    listItemTexto: {
      fontSize: 14,
      color: colores.text,
      flex: 1,
    },
    deleteButton: {
      padding: 4,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      backgroundColor: colores.primary,
      borderRadius: 8,
      marginTop: 8,
      gap: 8,
    },
    addButtonTexto: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: '#FFFFFF',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    modalContent: {
      backgroundColor: colores.card,
      borderRadius: 16,
      padding: 20,
      width: '100%',
      maxWidth: 400,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    modalTitulo: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colores.text,
    },
    modalBody: {
      gap: 12,
    },
    modalOption: {
      padding: 16,
      backgroundColor: colores.background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colores.border,
    },
    modalOptionTexto: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colores.text,
    },
    inputContainer: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
    },
    input: {
      flex: 1,
      padding: 12,
      backgroundColor: colores.background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colores.border,
      color: colores.text,
      fontSize: 14,
    },
    iconButton: {
      padding: 12,
      backgroundColor: colores.primary,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    etiquetasContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 8,
    },
    etiquetaChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingLeft: 12,
      paddingRight: 8,
      backgroundColor: colores.primary,
      borderRadius: 16,
      gap: 6,
    },
    etiquetaTexto: {
      fontSize: 13,
      fontWeight: '600' as const,
      color: '#FFFFFF',
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
          <Text style={styles.seccionTitulo}>Fechas y Horarios</Text>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={[styles.seccionTitulo, { fontSize: 14, marginBottom: 8 }]}>Fecha inicio</Text>
            <TouchableOpacity 
              style={styles.fechaButton}
              onPress={() => abrirDatePicker('start')}
            >
              <Text style={styles.fechaTexto}>{fechaInicio.toLocaleDateString('es-ES')}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={[styles.seccionTitulo, { fontSize: 14, marginBottom: 8 }]}>Fecha fin (si dura varios días)</Text>
            <TouchableOpacity 
              style={styles.fechaButton}
              onPress={() => abrirDatePicker('end')}
            >
              <Text style={styles.fechaTexto}>{fechaFin.toLocaleDateString('es-ES')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.seccionTitulo, { fontSize: 14, marginBottom: 8 }]}>Hora inicio</Text>
              <TouchableOpacity 
                style={styles.fechaButton}
                onPress={() => abrirTimePicker('start')}
              >
                <Text style={styles.fechaTexto}>{horaInicio}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.seccionTitulo, { fontSize: 14, marginBottom: 8 }]}>Hora fin</Text>
              <TouchableOpacity 
                style={styles.fechaButton}
                onPress={() => abrirTimePicker('end')}
              >
                <Text style={styles.fechaTexto}>{horaFin}</Text>
              </TouchableOpacity>
            </View>
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
          <Text style={styles.seccionTitulo}>Recordatorios</Text>
          <View style={styles.listContainer}>
            {recordatorios.map((rec) => (
              <View key={rec.id} style={styles.listItem}>
                <Text style={styles.listItemTexto}>{rec.etiqueta}</Text>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => eliminarRecordatorio(rec.id)}
                >
                  <X size={18} color={colores.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowRecordatoriosModal(true)}
          >
            <Plus size={18} color="#FFFFFF" />
            <Text style={styles.addButtonTexto}>Agregar recordatorio</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Etiquetas</Text>
          {etiquetas.length > 0 && (
            <View style={styles.etiquetasContainer}>
              {etiquetas.map((etiqueta) => (
                <View key={etiqueta} style={styles.etiquetaChip}>
                  <Text style={styles.etiquetaTexto}>{etiqueta}</Text>
                  <TouchableOpacity onPress={() => eliminarEtiqueta(etiqueta)}>
                    <X size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowEtiquetasModal(true)}
          >
            <Plus size={18} color="#FFFFFF" />
            <Text style={styles.addButtonTexto}>Agregar etiqueta</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Checklist</Text>
          <View style={styles.listContainer}>
            {checklist.map((item) => (
              <View key={item.id} style={styles.listItem}>
                <Text style={styles.listItemTexto}>{item.texto}</Text>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => eliminarChecklistItem(item.id)}
                >
                  <X size={18} color={colores.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowChecklistModal(true)}
          >
            <Plus size={18} color="#FFFFFF" />
            <Text style={styles.addButtonTexto}>Agregar tarea</Text>
          </TouchableOpacity>
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
                <Text style={[styles.seccionTitulo, { fontSize: 14, marginBottom: 8 }]}>Hasta cuándo repetir *</Text>
                <TouchableOpacity 
                  style={styles.fechaButton}
                  onPress={() => abrirDatePicker('recurrence')}
                >
                  <Text style={styles.fechaTexto}>
                    {fechaFinRecurrencia ? fechaFinRecurrencia.toLocaleDateString('es-ES') : 'Seleccionar fecha'}
                  </Text>
                </TouchableOpacity>
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

      {showDatePicker && (
        <DateTimePicker
          value={datePickerMode === 'start' ? fechaInicio : datePickerMode === 'end' ? fechaFin : fechaFinRecurrencia || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onTimeChange}
        />
      )}

      <Modal
        visible={showRecordatoriosModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRecordatoriosModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Agregar Recordatorio</Text>
              <TouchableOpacity onPress={() => setShowRecordatoriosModal(false)}>
                <X size={24} color={colores.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {RECORDATORIOS_PREDEF.map((rec, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalOption}
                  onPress={() => agregarRecordatorio(rec)}
                >
                  <Text style={styles.modalOptionTexto}>{rec.etiqueta}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showChecklistModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowChecklistModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Agregar Tarea</Text>
              <TouchableOpacity onPress={() => setShowChecklistModal(false)}>
                <X size={24} color={colores.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Escribe una tarea..."
                placeholderTextColor={colores.textSecondary}
                value={nuevoChecklistItem}
                onChangeText={setNuevoChecklistItem}
                onSubmitEditing={() => {
                  agregarChecklistItem();
                  setShowChecklistModal(false);
                }}
              />
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => {
                  agregarChecklistItem();
                  setShowChecklistModal(false);
                }}
              >
                <Check size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showEtiquetasModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEtiquetasModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Agregar Etiqueta</Text>
              <TouchableOpacity onPress={() => setShowEtiquetasModal(false)}>
                <X size={24} color={colores.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Escribe una etiqueta..."
                placeholderTextColor={colores.textSecondary}
                value={nuevaEtiqueta}
                onChangeText={setNuevaEtiqueta}
                onSubmitEditing={() => {
                  agregarEtiqueta();
                  setShowEtiquetasModal(false);
                }}
              />
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => {
                  agregarEtiqueta();
                  setShowEtiquetasModal(false);
                }}
              >
                <Check size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
