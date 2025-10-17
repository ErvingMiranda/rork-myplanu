import AsyncStorage from '@react-native-async-storage/async-storage';

let eventosCache: any[] | null = null;
let usuariosCache: any[] | null = null;
let amistadesCache: any[] | null = null;
let solicitudesCache: any[] | null = null;

let eventosCacheTime = 0;
let usuariosCacheTime = 0;
let amistadesCacheTime = 0;
let solicitudesCacheTime = 0;

const CACHE_TTL = 5000;

const KEYS = {
  USUARIOS: '@myplanu:usuarios',
  EVENTOS: '@myplanu:eventos',
  AMISTADES: '@myplanu:amistades',
  SOLICITUDES_EVENTO: '@myplanu:solicitudes_evento',
};

export async function inicializarDB(): Promise<void> {
  console.log('✅ AsyncStorage inicializado');
}

export async function obtenerUsuarios(): Promise<any[]> {
  const now = Date.now();
  if (usuariosCache && (now - usuariosCacheTime) < CACHE_TTL) {
    return usuariosCache as any[];
  }
  
  try {
    const data = await AsyncStorage.getItem(KEYS.USUARIOS);
    const result = data ? JSON.parse(data) : [];
    usuariosCache = result;
    usuariosCacheTime = now;
    return result;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
}

export async function guardarUsuarios(usuarios: any[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.USUARIOS, JSON.stringify(usuarios));
    usuariosCache = usuarios;
    usuariosCacheTime = Date.now();
  } catch (error) {
    console.error('Error al guardar usuarios:', error);
    throw new Error('No se pudo guardar la información del usuario');
  }
}

export async function obtenerEventos(): Promise<any[]> {
  const now = Date.now();
  if (eventosCache && (now - eventosCacheTime) < CACHE_TTL) {
    return eventosCache as any[];
  }
  
  try {
    const data = await AsyncStorage.getItem(KEYS.EVENTOS);
    const result = data ? JSON.parse(data) : [];
    eventosCache = result;
    eventosCacheTime = now;
    return result;
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    return [];
  }
}

export async function guardarEventos(eventos: any[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.EVENTOS, JSON.stringify(eventos));
    eventosCache = eventos;
    eventosCacheTime = Date.now();
  } catch (error) {
    console.error('Error al guardar eventos:', error);
    throw new Error('No se pudo guardar el evento');
  }
}

export async function obtenerAmistades(): Promise<any[]> {
  const now = Date.now();
  if (amistadesCache && (now - amistadesCacheTime) < CACHE_TTL) {
    return amistadesCache as any[];
  }
  
  try {
    const data = await AsyncStorage.getItem(KEYS.AMISTADES);
    const result = data ? JSON.parse(data) : [];
    amistadesCache = result;
    amistadesCacheTime = now;
    return result;
  } catch (error) {
    console.error('Error al obtener amistades:', error);
    return [];
  }
}

export async function guardarAmistades(amistades: any[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.AMISTADES, JSON.stringify(amistades));
    amistadesCache = amistades;
    amistadesCacheTime = Date.now();
  } catch (error) {
    console.error('Error al guardar amistades:', error);
    throw new Error('No se pudo guardar la información de amistades');
  }
}

export async function obtenerSolicitudesEvento(): Promise<any[]> {
  const now = Date.now();
  if (solicitudesCache && (now - solicitudesCacheTime) < CACHE_TTL) {
    return solicitudesCache as any[];
  }
  
  try {
    const data = await AsyncStorage.getItem(KEYS.SOLICITUDES_EVENTO);
    const result = data ? JSON.parse(data) : [];
    solicitudesCache = result;
    solicitudesCacheTime = now;
    return result;
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    return [];
  }
}

export async function guardarSolicitudesEvento(solicitudes: any[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.SOLICITUDES_EVENTO, JSON.stringify(solicitudes));
    solicitudesCache = solicitudes;
    solicitudesCacheTime = Date.now();
  } catch (error) {
    console.error('Error al guardar solicitudes:', error);
    throw new Error('No se pudo guardar la solicitud');
  }
}

export async function resetearDB(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([KEYS.USUARIOS, KEYS.EVENTOS, KEYS.AMISTADES, KEYS.SOLICITUDES_EVENTO]);
    eventosCache = null;
    usuariosCache = null;
    amistadesCache = null;
    solicitudesCache = null;
    console.log('🔄 Base de datos reseteada');
  } catch (error) {
    console.error('Error al resetear la base de datos:', error);
    throw new Error('No se pudo resetear la base de datos');
  }
}

export function invalidarCaches(): void {
  eventosCache = null;
  usuariosCache = null;
  amistadesCache = null;
  solicitudesCache = null;
  eventosCacheTime = 0;
  usuariosCacheTime = 0;
  amistadesCacheTime = 0;
  solicitudesCacheTime = 0;
}
