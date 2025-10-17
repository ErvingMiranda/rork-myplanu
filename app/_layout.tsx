import '../polyfills';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from '@/hooks/useAuth';
import { TemaProvider } from '@/hooks/useTema';
import { EventosProvider } from '@/hooks/useEventos';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { trpc, trpcClient } from '@/lib/trpc';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Atrás" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="crear-evento" options={{ presentation: 'modal', title: 'Crear Evento' }} />
      <Stack.Screen name="evento/[id]" options={{ title: 'Detalle del Evento' }} />
      <Stack.Screen name="editar-perfil" options={{ title: 'Editar Perfil' }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <TemaProvider>
              <AuthProvider>
                <EventosProvider>
                  <RootLayoutNav />
                </EventosProvider>
              </AuthProvider>
            </TemaProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}
