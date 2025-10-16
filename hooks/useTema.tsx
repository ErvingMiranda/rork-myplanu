import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { ajustesService } from '@/services/ajustesService';
import { TEMA_COMPLETO } from '@/constants/theme';
import type { Ajustes } from '@/types';

export const [TemaProvider, useTema] = createContextHook(() => {
  const colorScheme = useColorScheme();
  const [ajustes, setAjustes] = useState<Ajustes>({
    tema: 'light',
    zonaHoraria: 'America/Mexico_City',
    duracionPorDefecto: 60,
    vibracionHabilitada: true,
    notificacionesHabilitadas: true,
  });

  useEffect(() => {
    cargarAjustes();
  }, []);

  const cargarAjustes = async () => {
    const ajustesCargados = await ajustesService.obtener();
    setAjustes(ajustesCargados);
  };

  const actualizarAjustes = useCallback(async (nuevosAjustes: Partial<Ajustes>) => {
    await ajustesService.guardar(nuevosAjustes);
    setAjustes(prev => ({ ...prev, ...nuevosAjustes }));
  }, []);

  const temaActivo = useMemo(() => {
    if (ajustes.tema === 'auto') {
      return colorScheme === 'dark' ? 'dark' : 'light';
    }
    return ajustes.tema;
  }, [ajustes.tema, colorScheme]);

  const colores = useMemo(() => TEMA_COMPLETO[temaActivo], [temaActivo]);

  return useMemo(() => ({
    ajustes,
    temaActivo,
    colores,
    actualizarAjustes,
    isDark: temaActivo === 'dark',
  }), [ajustes, temaActivo, colores, actualizarAjustes]);
});
