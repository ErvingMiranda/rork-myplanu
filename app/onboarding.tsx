import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  FlatList, 
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Calendar, Clock, Bell } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Button } from '@/components/Button';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  titulo: string;
  descripcion: string;
  icono: React.ReactNode;
  gradient: string[];
}

export default function OnboardingScreen() {

  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const slides: OnboardingSlide[] = [
    {
      id: '1',
      titulo: 'Bienvenido a MyPlanU',
      descripcion: 'Organiza tu vida universitaria de forma inteligente. Gestiona clases, tareas y eventos en un solo lugar.',
      icono: <Calendar size={100} color="#FFFFFF" />,
      gradient: ['#00E5FF', '#7C4DFF'],
    },
    {
      id: '2',
      titulo: 'Horarios Inteligentes',
      descripcion: 'Crea horarios personalizados con recordatorios automáticos. Nunca más olvides una clase o entrega.',
      icono: <Clock size={100} color="#FFFFFF" />,
      gradient: ['#7C4DFF', '#9C6BFF'],
    },
    {
      id: '3',
      titulo: 'Notificaciones Oportunas',
      descripcion: 'Recibe alertas antes de tus eventos importantes. Mantente siempre al día con tus responsabilidades.',
      icono: <Bell size={100} color="#FFFFFF" />,
      gradient: ['#00E676', '#00E5FF'],
    },
  ];

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      router.replace('/(auth)/login' as any);
    }
  };

  const handleSkip = () => {
    router.replace('/(auth)/login' as any);
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <LinearGradient
      colors={item.gradient as any}
      style={styles.slide}
    >
      <View style={styles.iconContainer}>
        {item.icono}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        <Text style={styles.descripcion}>{item.descripcion}</Text>
      </View>
    </LinearGradient>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            { 
              backgroundColor: currentIndex === index ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
              width: currentIndex === index ? 24 : 8,
            }
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
      />
      
      {renderDots()}

      <View style={styles.buttonsContainer}>
        {currentIndex < slides.length - 1 ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Saltar</Text>
            </TouchableOpacity>
            <Button
              title="Siguiente"
              onPress={handleNext}
              variant="gradient"
              style={styles.nextButton}
            />
          </View>
        ) : (
          <Button
            title="Toque para continuar"
            onPress={handleNext}
            variant="gradient"
            style={styles.fullButton}
            size="large"
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 48,
  },
  textContainer: {
    alignItems: 'center',
  },
  titulo: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  descripcion: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonsContainer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 0 : 16,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  skipButton: {
    padding: 12,
    position: 'absolute' as const,
    left: 0,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  nextButton: {
    minWidth: 140,
  },
  fullButton: {
    width: '100%',
  },
});
