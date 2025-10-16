import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { EventoRepository } from '@/data/repositories/eventoRepository';
import { notificacionService } from '@/services/notificacionService';
import { useAuth } from './useAuth';
import type { Evento, EventoCrear } from '@/types';
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  getDay,
} from 'date-fns';

const eventoRepo = new EventoRepository();

export const [EventosProvider, useEventos] = createContextHook(() => {
  const { usuario } = useAuth();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [cargando, setCargando] = useState(false);

  const cargarEventos = useCallback(async () => {
    if (!usuario) return;

    setCargando(true);
    try {
      const eventosDB = await eventoRepo.obtenerPorUsuario(usuario.id);
      setEventos(eventosDB);
      console.log(`✅ ${eventosDB.length} eventos cargados`);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    } finally {
      setCargando(false);
    }
  }, [usuario]);

  useEffect(() => {
    if (usuario) {
      cargarEventos();
    }
  }, [usuario, cargarEventos]);

  const crear = useCallback(async (evento: EventoCrear) => {
    if (!usuario) throw new Error('Usuario no autenticado');

    const nuevoEvento = await eventoRepo.crear(evento, usuario.id);
    
    await notificacionService.programarRecordatorios(nuevoEvento);
    
    console.log('✅ Evento creado:', nuevoEvento.titulo);
    
    await cargarEventos();
    
    return nuevoEvento;
  }, [usuario, cargarEventos]);

  const actualizar = useCallback(async (id: string, datos: Partial<EventoCrear>) => {
    await eventoRepo.actualizar(id, datos);
    
    const eventoActualizado = await eventoRepo.obtenerPorId(id);
    if (eventoActualizado) {
      setEventos(prev => prev.map(e => e.id === id ? eventoActualizado : e));
      console.log('✅ Evento actualizado:', eventoActualizado.titulo);
    }
  }, []);

  const eliminar = useCallback(async (id: string) => {
    await eventoRepo.eliminar(id);
    setEventos(prev => prev.filter(e => e.id !== id));
    console.log('✅ Evento eliminado');
  }, []);

  const obtenerPorDia = useCallback((fecha: Date) => {
    return eventos.filter(evento => {
      const fechaEvento = new Date(evento.fechaInicio);
      const fechaFinEvento = new Date(evento.fechaFin);
      
      if (evento.esRecurrente && evento.diasSemana) {
        const diaFecha = getDay(fecha);
        if (!evento.diasSemana.includes(diaFecha)) return false;
        
        if (evento.fechaFinRecurrencia) {
          const fechaFinRecurrencia = new Date(evento.fechaFinRecurrencia);
          if (fecha > fechaFinRecurrencia) return false;
        }
        
        return fecha >= fechaEvento;
      }
      
      const fechaSoloDia = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
      const eventoInicioDia = new Date(fechaEvento.getFullYear(), fechaEvento.getMonth(), fechaEvento.getDate());
      const eventoFinDia = new Date(fechaFinEvento.getFullYear(), fechaFinEvento.getMonth(), fechaFinEvento.getDate());
      
      return fechaSoloDia >= eventoInicioDia && fechaSoloDia <= eventoFinDia;
    });
  }, [eventos]);

  const obtenerPorSemana = useCallback((fecha: Date) => {
    const inicio = startOfWeek(fecha, { weekStartsOn: 1 });
    const fin = endOfWeek(fecha, { weekStartsOn: 1 });
    
    return eventos.filter(evento => {
      const fechaEvento = new Date(evento.fechaInicio);
      
      if (evento.esRecurrente) {
        return true;
      }
      
      return fechaEvento >= inicio && fechaEvento <= fin;
    });
  }, [eventos]);

  const obtenerPorMes = useCallback((fecha: Date) => {
    const inicio = startOfMonth(fecha);
    const fin = endOfMonth(fecha);
    
    return eventos.filter(evento => {
      const fechaEvento = new Date(evento.fechaInicio);
      
      if (evento.esRecurrente) {
        return true;
      }
      
      return fechaEvento >= inicio && fechaEvento <= fin;
    });
  }, [eventos]);

  const obtenerEventosHoy = useCallback(() => {
    return obtenerPorDia(new Date());
  }, [obtenerPorDia]);

  return useMemo(() => ({
    eventos,
    cargando,
    crear,
    actualizar,
    eliminar,
    obtenerPorDia,
    obtenerPorSemana,
    obtenerPorMes,
    obtenerEventosHoy,
    recargar: cargarEventos,
  }), [eventos, cargando, crear, actualizar, eliminar, obtenerPorDia, obtenerPorSemana, obtenerPorMes, obtenerEventosHoy, cargarEventos]);
});
