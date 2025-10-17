import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { UserPlus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BORDES } from '@/constants/theme';
import { useTema } from '@/hooks/useTema';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export default function RegistroScreen() {
  const { colores } = useTema();
  const { registrar } = useAuth();
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({ nombre: '', email: '', pin: '', confirmPin: '' });

  const validar = (): boolean => {
    const nuevosErrores = { nombre: '', email: '', pin: '', confirmPin: '' };
    let valido = true;

    if (!email.trim()) {
      nuevosErrores.email = 'El correo es requerido';
      valido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nuevosErrores.email = 'Correo inválido';
      valido = false;
    }

    if (!pin.trim()) {
      nuevosErrores.pin = 'El PIN es requerido';
      valido = false;
    } else if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      nuevosErrores.pin = 'El PIN debe tener 4 dígitos';
      valido = false;
    }

    if (pin !== confirmPin) {
      nuevosErrores.confirmPin = 'Los PINs no coinciden';
      valido = false;
    }

    setErrores(nuevosErrores);
    return valido;
  };

  const handleRegistro = async () => {
    if (!validar()) return;

    setCargando(true);
    try {
      await registrar(email.trim().toLowerCase(), pin, nombre.trim() || undefined);
      router.replace('/hoy' as any);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al registrar');
    } finally {
      setCargando(false);
    }
  };

  const irALogin = () => {
    router.back();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colores.background,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingTop: 40,
      paddingBottom: 40,
    },
    header: {
      alignItems: 'center',
      marginBottom: 32,
    },
    iconContainer: {
      width: 100,
      height: 100,
      borderRadius: BORDES.redondo,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
      overflow: 'hidden',
    },
    titulo: {
      fontSize: 34,
      fontWeight: '700' as const,
      color: colores.text,
      marginBottom: 8,
    },
    subtitulo: {
      fontSize: 18,
      fontWeight: '500' as const,
      color: colores.textSecondary,
      textAlign: 'center',
    },
    form: {
      marginBottom: 24,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
    },
    footerText: {
      fontSize: 14,
      color: colores.textSecondary,
    },
    footerLink: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colores.primary,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={[colores.gradientStart, colores.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
              >
                <UserPlus size={48} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <Text style={styles.titulo}>Crear Cuenta</Text>
            <Text style={styles.subtitulo}>Únete a MyPlanU hoy</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Nombre (opcional)"
              placeholder="Tu nombre"
              value={nombre}
              onChangeText={setNombre}
              autoCapitalize="words"
              autoComplete="name"
            />

            <Input
              label="Correo electrónico"
              placeholder="tucorreo@universidad.edu"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrores(prev => ({ ...prev, email: '' }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errores.email}
            />

            <Input
              label="PIN (4 dígitos)"
              placeholder="••••"
              value={pin}
              onChangeText={(text) => {
                if (text.length <= 4 && /^\d*$/.test(text)) {
                  setPin(text);
                  setErrores(prev => ({ ...prev, pin: '' }));
                }
              }}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
              error={errores.pin}
            />

            <Input
              label="Confirmar PIN"
              placeholder="••••"
              value={confirmPin}
              onChangeText={(text) => {
                if (text.length <= 4 && /^\d*$/.test(text)) {
                  setConfirmPin(text);
                  setErrores(prev => ({ ...prev, confirmPin: '' }));
                }
              }}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
              error={errores.confirmPin}
            />

            <Button
              title="Crear Cuenta"
              onPress={handleRegistro}
              loading={cargando}
              variant="gradient"
              size="large"
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={irALogin}>
              <Text style={styles.footerLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
