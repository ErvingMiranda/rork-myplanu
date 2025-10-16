import AsyncStorage from '@react-native-async-storage/async-storage';

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
  try {
    const data = await AsyncStorage.getItem(KEYS.USUARIOS);
    if (!data) return [];
    
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (parseError: any) {
      console.error('❌ Error al parsear usuarios, datos corruptos:', parseError?.message);
      console.error('Datos corruptos (primeros 200 caracteres):', data.substring(0, 200));
      await AsyncStorage.removeItem(KEYS.USUARIOS);
      console.log('🧹 Datos corruptos eliminados, comenzando con base limpia');
      return [];
    }
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
}

export async function guardarUsuarios(usuarios: any[]): Promise<void> {
  try {
    const cleaned = usuarios.map((u, index) => {
      try {
        const user: any = {
          id: String(u.id || ''),
          email: String(u.email || ''),
          pin: String(u.pin || ''),
          eventosPublicos: Boolean(u.eventosPublicos),
          createdAt: String(u.createdAt || new Date().toISOString()),
        };
        
        if (u.nombre && typeof u.nombre === 'string') {
          const cleaned = u.nombre.trim().replace(/[\x00-\x1F\x7F-\x9F]/g, '');
          if (cleaned) user.nombre = cleaned;
        }
        
        if (u.descripcion && typeof u.descripcion === 'string') {
          const cleaned = u.descripcion.trim().replace(/[\x00-\x1F\x7F-\x9F]/g, '');
          if (cleaned) user.descripcion = cleaned;
        }
        
        if (u.fotoPerfil && typeof u.fotoPerfil === 'string') {
          const cleaned = u.fotoPerfil.trim();
          if (cleaned) user.fotoPerfil = cleaned;
        }
        
        return user;
      } catch (innerError) {
        console.error(`Error procesando usuario en indice ${index}`);
        throw new Error('Error al procesar datos de usuario');
      }
    });
    
    const serialized = JSON.stringify(cleaned);
    
    try {
      JSON.parse(serialized);
    } catch (parseError) {
      console.error('Error: JSON no valido');
      throw new Error('Error al validar datos');
    }
    
    await AsyncStorage.setItem(KEYS.USUARIOS, serialized);
    console.log('✅ Usuarios guardados correctamente');
  } catch (error: any) {
    console.error('Error al guardar usuarios');
    throw new Error('Error al guardar usuarios');
  }
}

export async function obtenerEventos(): Promise<any[]> {
  const data = await AsyncStorage.getItem(KEYS.EVENTOS);
  return data ? JSON.parse(data) : [];
}

export async function guardarEventos(eventos: any[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.EVENTOS, JSON.stringify(eventos));
}

export async function obtenerAmistades(): Promise<any[]> {
  const data = await AsyncStorage.getItem(KEYS.AMISTADES);
  return data ? JSON.parse(data) : [];
}

export async function guardarAmistades(amistades: any[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.AMISTADES, JSON.stringify(amistades));
}

export async function obtenerSolicitudesEvento(): Promise<any[]> {
  const data = await AsyncStorage.getItem(KEYS.SOLICITUDES_EVENTO);
  return data ? JSON.parse(data) : [];
}

export async function guardarSolicitudesEvento(solicitudes: any[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.SOLICITUDES_EVENTO, JSON.stringify(solicitudes));
}

export async function resetearDB(): Promise<void> {
  await AsyncStorage.multiRemove([KEYS.USUARIOS, KEYS.EVENTOS, KEYS.AMISTADES, KEYS.SOLICITUDES_EVENTO]);
  console.log('🔄 Base de datos reseteada');
}
