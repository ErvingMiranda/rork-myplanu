import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useTema } from '@/hooks/useTema';
import { BORDES, SOMBRAS } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  testID?: string;
}

export function Card({ children, style, onPress, testID }: CardProps) {
  const { colores } = useTema();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colores.card,
      borderRadius: BORDES.card,
      padding: 16,
      ...SOMBRAS.suave,
    },
  });

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.card, style]}
        onPress={onPress}
        activeOpacity={0.7}
        testID={testID}
        accessible={true}
        accessibilityRole="button"
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, style]} testID={testID}>
      {children}
    </View>
  );
}
