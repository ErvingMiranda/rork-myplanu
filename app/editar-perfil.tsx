import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Platform, ActionSheetIOS, Image } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTema } from '@/hooks/useTema';
import { useAuth } from '@/hooks/useAuth';
import { BORDES, SOMBRAS } from '@/constants/theme';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { trpc } from '@/lib/trpc';

export default function EditarPerfilScreen() {
  const { colores } = useTema();
  const { usuario, actualizarUsuario } = useAuth();
  const actualizarUsuarioMutation = trpc.usuarios.actualizar.useMutation();
  
  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [descripcion, setDescripcion] = useState(usuario?.descripcion || '');
  const [pinActual, setPinActual] = useState('');
  const [pinNuevo, setPinNuevo] = useState('');
  const [pinConfirmar, setPinConfirmar] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(usuario?.fotoPerfil || null);

  const handleSeleccionarFoto = async () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancelar', 'Tomar Foto', 'Elegir de Galería', 'Elegir Archivo'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            await tomarFoto();
          } else if (buttonIndex === 2) {
            await elegirDeGaleria();
          } else if (buttonIndex === 3) {
            await elegirArchivo();
          }
        }
      );
    } else {
      Alert.alert(
        'Cambiar Foto',
        'Selecciona una opción',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Tomar Foto', onPress: tomarFoto },
          { text: 'Elegir de Galería', onPress: elegirDeGaleria },
          { text: 'Elegir Archivo', onPress: elegirArchivo },
        ]
      );
    }
  };

  const tomarFoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita permiso para acceder a la cámara');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFotoPerfil(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const elegirDeGaleria = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita permiso para acceder a la galería');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFotoPerfil(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al elegir de galería:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const elegirArchivo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita permiso para acceder a los archivos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFotoPerfil(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al elegir archivo:', error);
      Alert.alert('Error', 'No se pudo seleccionar el archivo');
    }
  };

  const handleGuardarPerfil = async () => {
    if (!usuario) return;
    
    if (nombre.trim().length < 2) {
      Alert.alert('Error', 'El nombre debe tener al menos 2 caracteres');
      return;
    }

    try {
      setGuardando(true);
      const usuarioActualizado = await actualizarUsuarioMutation.mutateAsync({
        usuarioId: usuario.id,
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        fotoPerfil: fotoPerfil || undefined,
      });
      actualizarUsuario(usuarioActualizado);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
      console.error('Error al actualizar perfil:', error);
    } finally {
      setGuardando(false);
    }
  };

  const handleCambiarPin = async () => {
    if (!usuario) return;

    if (pinActual !== usuario.pin) {
      Alert.alert('Error', 'El PIN actual es incorrecto');
      return;
    }

    if (pinNuevo.length !== 4 || !/^\d{4}$/.test(pinNuevo)) {
      Alert.alert('Error', 'El nuevo PIN debe tener 4 dígitos');
      return;
    }

    if (pinNuevo !== pinConfirmar) {
      Alert.alert('Error', 'Los PINs nuevos no coinciden');
      return;
    }

    try {
      setGuardando(true);
      const usuarioActualizado = await actualizarUsuarioMutation.mutateAsync({
        usuarioId: usuario.id,
      });
      
      setPinActual('');
      setPinNuevo('');
      setPinConfirmar('');
      
      Alert.alert('Éxito', 'PIN actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el PIN');
      console.error('Error al actualizar PIN:', error);
    } finally {
      setGuardando(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colores.background,
    },
    scrollContent: {
      padding: 16,
    },
    avatarContainer: {
      alignItems: 'center',
      marginBottom: 32,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: BORDES.redondo,
      backgroundColor: colores.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      overflow: 'hidden' as const,
      ...SOMBRAS.media,
    },
    avatarImage: {
      width: 100,
      height: 100,
    },
    avatarLabel: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colores.primary,
    },
    seccion: {
      marginBottom: 32,
    },
    seccionTitulo: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colores.text,
      marginBottom: 16,
    },
    card: {
      padding: 16,
    },
    emailContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 12,
    },
    emailLabel: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colores.textSecondary,
      marginBottom: 4,
    },
    emailValue: {
      fontSize: 16,
      color: colores.text,
      flex: 1,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colores.text,
      marginBottom: 8,
    },
    buttonContainer: {
      marginTop: 16,
    },
    divider: {
      height: 1,
      backgroundColor: colores.border,
      marginVertical: 16,
    },
  });

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Editar Perfil',
          headerStyle: {
            backgroundColor: colores.card,
          },
          headerTintColor: colores.text,
          headerShadowVisible: false,
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {fotoPerfil ? (
                <Image source={{ uri: fotoPerfil }} style={styles.avatarImage} />
              ) : (
                <User size={50} color="#FFFFFF" />
              )}
            </View>
            <TouchableOpacity onPress={handleSeleccionarFoto}>
              <Text style={styles.avatarLabel}>Cambiar foto</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>Información Personal</Text>
            <Card style={styles.card}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre</Text>
                <Input
                  value={nombre}
                  onChangeText={setNombre}
                  placeholder="Tu nombre"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Descripción</Text>
                <Input
                  value={descripcion}
                  onChangeText={setDescripcion}
                  placeholder="Cuéntanos sobre ti, tus gustos, hobbies..."
                  multiline
                  numberOfLines={4}
                  style={{ minHeight: 100, textAlignVertical: 'top' }}
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  title="Guardar Cambios"
                  onPress={handleGuardarPerfil}
                  disabled={!nombre.trim()}
                  loading={guardando}
                  variant="primary"
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.emailContainer}>
                <Mail size={20} color={colores.textSecondary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.emailLabel}>Correo electrónico</Text>
                  <Text style={styles.emailValue}>{usuario?.email}</Text>
                </View>
              </View>
            </Card>
          </View>

          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>Cambiar PIN</Text>
            <Card style={styles.card}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>PIN Actual</Text>
                <Input
                  value={pinActual}
                  onChangeText={setPinActual}
                  placeholder="****"
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nuevo PIN</Text>
                <Input
                  value={pinNuevo}
                  onChangeText={setPinNuevo}
                  placeholder="****"
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmar Nuevo PIN</Text>
                <Input
                  value={pinConfirmar}
                  onChangeText={setPinConfirmar}
                  placeholder="****"
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  title="Cambiar PIN"
                  onPress={handleCambiarPin}
                  disabled={!pinActual || !pinNuevo || !pinConfirmar}
                  loading={guardando}
                  variant="primary"
                />
              </View>
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
