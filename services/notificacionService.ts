import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Evento, Recordatorio } from '@/types';

let notificationsSupported = true;

try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch {
  notificationsSupported = false;
}

export class NotificacionService {
  async solicitarPermisos(): Promise<boolean> {
    if (Platform.OS === 'web' || !notificationsSupported) {
      return false;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch {
      return false;
    }
  }

  private calcularMinutos(recordatorio: Recordatorio): number {
    switch (recordatorio.tipo) {
      case 'minutos':
        return recordatorio.cantidad;
      case 'horas':
        return recordatorio.cantidad * 60;
      case 'dias':
        return recordatorio.cantidad * 24 * 60;
      default:
        return 0;
    }
  }

  async programarRecordatorios(evento: Evento): Promise<string[]> {
    if (Platform.OS === 'web' || !notificationsSupported) {
      return [];
    }

    const identificadores: string[] = [];
    const fechaEvento = new Date(evento.fechaInicio);

    for (const recordatorio of evento.recordatorios) {
      const minutos = this.calcularMinutos(recordatorio);
      if (minutos === 0) continue;

      const fechaNotificacion = new Date(fechaEvento.getTime() - minutos * 60 * 1000);
      
      if (fechaNotificacion.getTime() <= Date.now()) {
        continue;
      }

      try {
        const segundos = Math.floor((fechaNotificacion.getTime() - Date.now()) / 1000);
        
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: evento.titulo,
            body: `${evento.curso || 'Evento'} - ${recordatorio.etiqueta}`,
            data: { eventoId: evento.id },
            sound: true,
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: segundos > 0 ? segundos : 1 },
        });

        identificadores.push(id);
      } catch {
        
      }
    }

    return identificadores;
  }

  async cancelarNotificaciones(identificadores: string[]): Promise<void> {
    if (Platform.OS === 'web' || !notificationsSupported) return;

    for (const id of identificadores) {
      try {
        await Notifications.cancelScheduledNotificationAsync(id);
      } catch {
        
      }
    }
  }

  async cancelarTodas(): Promise<void> {
    if (Platform.OS === 'web' || !notificationsSupported) return;
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch {
      
    }
  }
}

export const notificacionService = new NotificacionService();
