import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useTema } from '@/hooks/useTema';

export default function IndexScreen() {
  const { estaAutenticado, cargando, inicializado } = useAuth();
  const { colores } = useTema();
  const router = useRouter();

  useEffect(() => {
    if (!cargando && inicializado) {
      if (estaAutenticado) {
        router.replace('/hoy' as any);
      } else {
        router.replace('/onboarding' as any);
      }
    }
  }, [cargando, inicializado, estaAutenticado, router]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colores.background,
    },
  });

  if (cargando || !inicializado) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colores.primary} />
      </View>
    );
  }

  return null;
}
