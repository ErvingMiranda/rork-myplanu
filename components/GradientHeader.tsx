import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientHeaderProps {
  title: string;
  subtitle?: string;
  startColor: string;
  endColor: string;
  paddingTopExtra?: number;
  height?: number;
  overlap?: number;
  leftIcon?: ReactNode;
}

export function GradientHeader({
  title,
  subtitle,
  startColor,
  endColor,
  paddingTopExtra = 16,
  height = 140,
  overlap = 20,
  leftIcon,
}: GradientHeaderProps) {
  const insets = useSafeAreaInsets();
  const paddingTop = insets.top + paddingTopExtra;

  const styles = StyleSheet.create({
    gradient: {
      paddingTop,
      height,
      paddingHorizontal: 24,
      justifyContent: 'center',
      zIndex: 0,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 22,
      lineHeight: 26,
      fontWeight: '700' as const,
      color: '#FFFFFF',
      marginBottom: subtitle ? 4 : 0,
    },
    subtitle: {
      fontSize: 13,
      color: 'rgba(255, 255, 255, 0.9)',
    },
  });

  return (
    <LinearGradient
      colors={[startColor, endColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.content}>
        {leftIcon}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    </LinearGradient>
  );
}

export function useGradientHeaderOverlap(overlap: number = 20) {
  return { marginTop: -overlap };
}
