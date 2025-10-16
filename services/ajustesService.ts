import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Ajustes } from '@/types';

const AJUSTES_KEY = '@myplanu_ajustes';

const AJUSTES_POR_DEFECTO: Ajustes = {
  tema: 'light',
  zonaHoraria: 'America/Mexico_City',
  duracionPorDefecto: 60,
  vibracionHabilitada: true,
  notificacionesHabilitadas: true,
};

export class AjustesService {
  async obtener(): Promise<Ajustes> {
    try {
      const data = await AsyncStorage.getItem(AJUSTES_KEY);
      if (!data) return AJUSTES_POR_DEFECTO;
      
      return { ...AJUSTES_POR_DEFECTO, ...JSON.parse(data) };
    } catch (error) {
      console.error('Error al obtener ajustes:', error);
      return AJUSTES_POR_DEFECTO;
    }
  }

  async guardar(ajustes: Partial<Ajustes>): Promise<void> {
    try {
      const actuales = await this.obtener();
      const nuevos = { ...actuales, ...ajustes };
      await AsyncStorage.setItem(AJUSTES_KEY, JSON.stringify(nuevos));
    } catch (error) {
      console.error('Error al guardar ajustes:', error);
      throw error;
    }
  }

  async resetear(): Promise<void> {
    await AsyncStorage.removeItem(AJUSTES_KEY);
  }
}

export const ajustesService = new AjustesService();
