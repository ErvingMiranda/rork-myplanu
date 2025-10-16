import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useAmigos } from './useAmigos';
import { EventoRepository } from '@/data/repositories/eventoRepository';
import { UsuarioRepository } from '@/data/repositories/usuarioRepository';
import type { Evento, Usuario } from '@/types';

const eventoRepo = new EventoRepository();
const usuarioRepo = new UsuarioRepository();

export interface EventoAmigo extends Evento {
  propietario: Usuario;
}

export function useEventosAmigos() {
  const { usuario: usuarioActual } = useAuth();
  const { amigos } = useAmigos();
  const [eventosAmigos, setEventosAmigos] = useState<EventoAmigo[]>([]);
  const [cargando, setCargando] = useState(false);

  const cargarEventosAmigos = async () => {
    if (!usuarioActual || amigos.length === 0) {
      setEventosAmigos([]);
      return;
    }

    setCargando(true);
    try {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const finDia = new Date(hoy);
      finDia.setHours(23, 59, 59, 999);

      const promesasEventos = amigos.map(async (amigo) => {
        const usuario = await usuarioRepo.obtenerPorId(amigo.usuario.id);
        
        if (!usuario || !usuario.eventosPublicos) {
          return [];
        }

        const eventosAmigo = await eventoRepo.obtenerPorRango(
          amigo.usuario.id,
          hoy.toISOString(),
          finDia.toISOString()
        );

        return eventosAmigo
          .filter(evento => evento.esPublico)
          .map((evento): EventoAmigo => ({
            ...evento,
            propietario: usuario,
          }));
      });

      const resultados = await Promise.all(promesasEventos);
      const todosEventos = resultados.flat();

      todosEventos.sort((a, b) => 
        new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
      );

      setEventosAmigos(todosEventos);
    } catch (error) {
      console.error('Error cargando eventos de amigos:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEventosAmigos();
  }, [usuarioActual, amigos]);

  return {
    eventosAmigos,
    cargando,
    recargar: cargarEventosAmigos,
  };
}
