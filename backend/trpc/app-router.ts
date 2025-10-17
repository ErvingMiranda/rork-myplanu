import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { buscarUsuariosProcedure } from "./routes/usuarios/buscar/route";
import { loginProcedure } from "./routes/usuarios/login/route";
import { registrarProcedure } from "./routes/usuarios/registrar/route";
import { obtenerPorIdProcedure } from "./routes/usuarios/obtener-por-id/route";
import { eliminarUsuarioProcedure } from "./routes/usuarios/eliminar/route";
import { actualizarUsuarioProcedure } from "./routes/usuarios/actualizar/route";
import { enviarSolicitudProcedure } from "./routes/amistades/enviar-solicitud/route";
import { misAmigosProcedure } from "./routes/amistades/mis-amigos/route";
import { solicitudesPendientesProcedure } from "./routes/amistades/solicitudes-pendientes/route";
import { solicitudesEnviadasProcedure } from "./routes/amistades/solicitudes-enviadas/route";
import { aceptarSolicitudProcedure } from "./routes/amistades/aceptar-solicitud/route";
import { rechazarSolicitudProcedure } from "./routes/amistades/rechazar-solicitud/route";
import { eliminarAmigoProcedure } from "./routes/amistades/eliminar-amigo/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  usuarios: createTRPCRouter({
    buscar: buscarUsuariosProcedure,
    login: loginProcedure,
    registrar: registrarProcedure,
    obtenerPorId: obtenerPorIdProcedure,
    eliminar: eliminarUsuarioProcedure,
    actualizar: actualizarUsuarioProcedure,
  }),
  amistades: createTRPCRouter({
    enviarSolicitud: enviarSolicitudProcedure,
    misAmigos: misAmigosProcedure,
    solicitudesPendientes: solicitudesPendientesProcedure,
    solicitudesEnviadas: solicitudesEnviadasProcedure,
    aceptarSolicitud: aceptarSolicitudProcedure,
    rechazarSolicitud: rechazarSolicitudProcedure,
    eliminarAmigo: eliminarAmigoProcedure,
  }),
});

export type AppRouter = typeof appRouter;
