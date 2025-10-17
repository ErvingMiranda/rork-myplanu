import { Usuario, Amistad, Evento, SolicitudEvento } from '@/types';

let usuarios: Usuario[] = [];
let amistades: Amistad[] = [];
let eventos: Evento[] = [];
let solicitudesEvento: SolicitudEvento[] = [];

export const db = {
  usuarios: {
    getAll: () => usuarios,
    getById: (id: string) => usuarios.find(u => u.id === id),
    getByEmail: (email: string) => usuarios.find(u => u.email.toLowerCase() === email.toLowerCase()),
    create: (usuario: Usuario) => {
      usuarios.push(usuario);
      return usuario;
    },
    update: (id: string, data: Partial<Usuario>) => {
      const index = usuarios.findIndex(u => u.id === id);
      if (index !== -1) {
        usuarios[index] = { ...usuarios[index], ...data };
        return usuarios[index];
      }
      return null;
    },
    search: (query: string, excludeId?: string) => {
      const lowerQuery = query.toLowerCase();
      return usuarios.filter(u => {
        if (excludeId && u.id === excludeId) return false;
        return u.email.toLowerCase().includes(lowerQuery) || 
               (u.nombre && u.nombre.toLowerCase().includes(lowerQuery));
      });
    },
  },
  
  amistades: {
    getAll: () => amistades,
    getById: (id: string) => amistades.find(a => a.id === id),
    getByUsuario: (usuarioId: string, estado?: string) => {
      return amistades.filter(a => {
        const perteneceAlUsuario = a.usuarioId === usuarioId || a.amigoId === usuarioId;
        const cumpleEstado = estado ? a.estado === estado : true;
        return perteneceAlUsuario && cumpleEstado;
      });
    },
    getSolicitudesPendientes: (usuarioId: string) => {
      return amistades.filter(a => a.amigoId === usuarioId && a.estado === 'pendiente');
    },
    getSolicitudesEnviadas: (usuarioId: string) => {
      return amistades.filter(a => a.usuarioId === usuarioId && a.estado === 'pendiente');
    },
    create: (amistad: Amistad) => {
      amistades.push(amistad);
      return amistad;
    },
    update: (id: string, data: Partial<Amistad>) => {
      const index = amistades.findIndex(a => a.id === id);
      if (index !== -1) {
        amistades[index] = { ...amistades[index], ...data };
        return amistades[index];
      }
      return null;
    },
    delete: (usuarioId: string, amigoId: string) => {
      const initialLength = amistades.length;
      amistades = amistades.filter(a => 
        !((a.usuarioId === usuarioId && a.amigoId === amigoId) || 
          (a.usuarioId === amigoId && a.amigoId === usuarioId))
      );
      return amistades.length < initialLength;
    },
  },
  
  eventos: {
    getAll: () => eventos,
    getById: (id: string) => eventos.find(e => e.id === id),
    getByUsuario: (usuarioId: string) => {
      return eventos.filter(e => 
        e.userId === usuarioId || 
        (e.usuariosCompartidos && e.usuariosCompartidos.includes(usuarioId))
      );
    },
    getPublicos: () => eventos.filter(e => e.esPublico),
    create: (evento: Evento) => {
      eventos.push(evento);
      return evento;
    },
    update: (id: string, data: Partial<Evento>) => {
      const index = eventos.findIndex(e => e.id === id);
      if (index !== -1) {
        eventos[index] = { ...eventos[index], ...data, updatedAt: new Date().toISOString() };
        return eventos[index];
      }
      return null;
    },
    delete: (id: string) => {
      const initialLength = eventos.length;
      eventos = eventos.filter(e => e.id !== id);
      return eventos.length < initialLength;
    },
  },
  
  solicitudesEvento: {
    getAll: () => solicitudesEvento,
    getById: (id: string) => solicitudesEvento.find(s => s.id === id),
    getByDestinatario: (destinatarioId: string) => {
      return solicitudesEvento.filter(s => s.destinatarioId === destinatarioId);
    },
    create: (solicitud: SolicitudEvento) => {
      solicitudesEvento.push(solicitud);
      return solicitud;
    },
    update: (id: string, data: Partial<SolicitudEvento>) => {
      const index = solicitudesEvento.findIndex(s => s.id === id);
      if (index !== -1) {
        solicitudesEvento[index] = { ...solicitudesEvento[index], ...data, updatedAt: new Date().toISOString() };
        return solicitudesEvento[index];
      }
      return null;
    },
  },
};
