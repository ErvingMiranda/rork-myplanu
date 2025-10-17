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
import { LogIn } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BORDES } from '@/constants/theme';
import { useTema } from '@/hooks/useTema';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export default function LoginScreen() {
  const { colores } = useTema();
  const { iniciarSesion } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({ email: '', pin: '' });

  const validar = (): boolean => {
    const nuevosErrores = { email: '', pin: '' };
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

    setErrores(nuevosErrores);
    return valido;
  };

  const handleLogin = async () => {
    if (!validar()) return;

    setCargando(true);
    try {
      console.log('🔐 Intentando iniciar sesión con:', email.trim().toLowerCase());
      await iniciarSesion(email.trim().toLowerCase(), pin);
      console.log('✅ Inicio de sesión exitoso');
      router.replace('/hoy' as any);
    } catch (error: any) {
      console.error('❌ Error al iniciar sesión:', error);
      Alert.alert(
        'Error al iniciar sesión',
        error.message === 'Credenciales incorrectas'
          ? 'El correo o PIN no coinciden. Por favor verifica tus datos o regístrate si no tienes cuenta.'
          : error.message || 'Error al iniciar sesión'
      );
    } finally {
      setCargando(false);
    }
  };

  const irARegistro = () => {
    router.push('/(auth)/registro' as any);
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
      paddingTop: 60,
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
      marginTop: 24,
      gap: 4,
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
                <LogIn size={48} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <Text style={styles.titulo}>MyPlanU</Text>
            <Text style={styles.subtitulo}>Organiza tu vida universitaria</Text>
          </View>

          <View style={styles.form}>
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
              testID="input-email"
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
              testID="input-pin"
            />

            <Button
              title="Iniciar Sesión"
              onPress={handleLogin}
              loading={cargando}
              variant="gradient"
              size="large"
              testID="button-login"
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes cuenta?</Text>
            <TouchableOpacity onPress={irARegistro}>
              <Text style={styles.footerLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
