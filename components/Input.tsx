import React from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextInputProps,
} from 'react-native';
import { useTema } from '@/hooks/useTema';
import { BORDES, SOMBRAS } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  testID?: string;
}

export function Input({
  label,
  error,
  containerStyle,
  testID,
  ...textInputProps
}: InputProps) {
  const { colores } = useTema();

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colores.text,
      marginBottom: 8,
    },
    inputContainer: {
      borderWidth: 2,
      borderColor: error ? colores.error : colores.primary,
      borderRadius: BORDES.input,
      backgroundColor: colores.card,
      ...SOMBRAS.suave,
    },
    input: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colores.text,
      minHeight: 52,
    },
    error: {
      fontSize: 12,
      color: colores.error,
      marginTop: 4,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          {...textInputProps}
          style={[styles.input, textInputProps.style]}
          placeholderTextColor={colores.textSecondary}
          testID={testID}
          accessible={true}
          accessibilityLabel={label || textInputProps.placeholder}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}
