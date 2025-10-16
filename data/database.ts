import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USUARIOS: '@myplanu:usuarios',
  EVENTOS: '@myplanu:eventos',
};

export async function inicializarDB(): Promise<void> {
  console.log('✅ AsyncStorage inicializado');
}

export async function obtenerUsuarios(): Promise<any[]> {
  const data = await AsyncStorage.getItem(KEYS.USUARIOS);
  return data ? JSON.parse(data) : [];
}

export async function guardarUsuarios(usuarios: any[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.USUARIOS, JSON.stringify(usuarios));
}

export async function obtenerEventos(): Promise<any[]> {
  const data = await AsyncStorage.getItem(KEYS.EVENTOS);
  return data ? JSON.parse(data) : [];
}

export async function guardarEventos(eventos: any[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.EVENTOS, JSON.stringify(eventos));
}

export async function resetearDB(): Promise<void> {
  await AsyncStorage.multiRemove([KEYS.USUARIOS, KEYS.EVENTOS]);
  console.log('🔄 Base de datos reseteada');
}
