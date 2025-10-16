import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle,
} from 'react-native';
import { useTema } from '@/hooks/useTema';
import { BORDES, SOMBRAS } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export function Button({
  onPress,
  title,
  variant = 'primary' as const,
  size = 'medium' as const,
  disabled = false,
  loading = false,
  style,
  textStyle,
  testID,
}: ButtonProps) {
  const { colores } = useTema();

  const getButtonStyle = (): ViewStyle => {
    const base: ViewStyle = {
      borderRadius: variant === 'gradient' || variant === 'primary' ? BORDES.boton : BORDES.input,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      overflow: 'hidden',
    };

    const sizeStyles: Record<'small' | 'medium' | 'large', ViewStyle> = {
      small: { paddingVertical: 10, paddingHorizontal: 20, minHeight: 40 },
      medium: { paddingVertical: 14, paddingHorizontal: 28, minHeight: 48 },
      large: { paddingVertical: 16, paddingHorizontal: 32, minHeight: 56 },
    };

    const variantStyles: Record<'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient', ViewStyle> = {
      primary: { 
        backgroundColor: colores.primary,
        ...SOMBRAS.suave,
      },
      secondary: { 
        backgroundColor: colores.secondary,
        ...SOMBRAS.suave,
      },
      outline: { 
        backgroundColor: 'transparent', 
        borderWidth: 2, 
        borderColor: colores.primary 
      },
      ghost: { backgroundColor: 'transparent' },
      gradient: {
        backgroundColor: 'transparent',
        ...SOMBRAS.media,
      },
    };

    return {
      ...base,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(disabled && { opacity: 0.5 }),
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles: Record<'small' | 'medium' | 'large', TextStyle> = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    const variantStyles: Record<'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient', TextStyle> = {
      primary: { color: '#FFFFFF' },
      secondary: { color: '#000000' },
      outline: { color: colores.primary },
      ghost: { color: colores.primary },
      gradient: { color: '#FFFFFF' },
    };

    return {
      fontWeight: '700' as const,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'gradient' ? '#FFFFFF' : colores.primary}
        />
      );
    }
    return <Text style={[getTextStyle(), textStyle]}>{title}</Text>;
  };

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[getButtonStyle(), style]}
        testID={testID}
        accessible={true}
        accessibilityLabel={title}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading }}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[colores.gradientStart, colores.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        />
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyle(), style]}
      testID={testID}
      accessible={true}
      accessibilityLabel={title}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}
