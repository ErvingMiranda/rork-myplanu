import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

let cachedBaseUrl: string | null = null;

const getBaseUrl = () => {
  if (cachedBaseUrl) {
    return cachedBaseUrl;
  }

  const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  
  console.log('🔍 Checking backend URL...');
  console.log('🔍 EXPO_PUBLIC_RORK_API_BASE_URL:', baseUrl);
  console.log('🔍 All env vars:', Object.keys(process.env).filter(k => k.includes('EXPO') || k.includes('RORK')));
  
  if (!baseUrl) {
    console.error('❌ EXPO_PUBLIC_RORK_API_BASE_URL no está configurado');
    console.error('❌');
    console.error('❌ INSTRUCCIONES PARA SOLUCIONAR:');
    console.error('❌ 1. Detener el servidor actual');
    console.error('❌ 2. Asegúrate de tener la carpeta "backend/" en tu proyecto');
    console.error('❌ 3. Reiniciar el servidor con: bun start');
    console.error('❌ 4. La plataforma Rork debería detectar automáticamente el backend');
    console.error('❌');
    throw new Error(
      "Backend URL not configured. Please restart the dev server."
    );
  }
  
  const cleanUrl = baseUrl.replace(/\/+$/, '');
  cachedBaseUrl = cleanUrl;
  console.log('✅ Using backend URL:', cleanUrl);
  return cleanUrl;
};

let trpcClientInstance: ReturnType<typeof trpc.createClient> | null = null;

export const getTrpcClient = () => {
  if (!trpcClientInstance) {
    trpcClientInstance = trpc.createClient({
      links: [
        httpLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
          fetch: async (url, options) => {
            try {
              console.log('🌐 tRPC Request URL:', url);
              console.log('🌐 tRPC Request method:', options?.method || 'GET');
              
              const response = await fetch(url, options);
              
              console.log('📨 tRPC Response status:', response.status);
              console.log('📨 tRPC Response headers:', JSON.stringify([...response.headers.entries()]));
              
              if (!response.ok) {
                const text = await response.text();
                console.error('❌ tRPC Response Error:', response.status);
                console.error('❌ Response body:', text.substring(0, 500));
                console.error('❌ Response URL:', response.url);
                
                if (response.status === 404) {
                  throw new Error(
                    'Backend endpoint not found (404). El servidor de backend no está respondiendo correctamente. Por favor, reinicia el servidor de desarrollo.'
                  );
                }
                
                throw new Error(`Server error: ${response.status}`);
              }
              
              return response;
            } catch (error) {
              console.error('❌ tRPC Fetch Error:', error);
              console.error('❌ Error details:', {
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
              });
              throw error;
            }
          },
        }),
      ],
    });
  }
  return trpcClientInstance;
};

export const trpcClient = getTrpcClient();
