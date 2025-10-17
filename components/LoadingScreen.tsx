import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTema } from '@/hooks/useTema';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Cargando...' }) => {
  const { colores } = useTema();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colores.background,
      padding: 24,
    },
    text: {
      marginTop: 16,
      fontSize: 16,
      color: colores.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colores.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};
