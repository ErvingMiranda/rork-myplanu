import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  
  console.log('🔍 EXPO_PUBLIC_RORK_API_BASE_URL:', baseUrl);
  
  if (!baseUrl) {
    console.error('❌ EXPO_PUBLIC_RORK_API_BASE_URL no está configurado');
    console.error('Verifica que el backend esté habilitado en la plataforma Rork');
    throw new Error(
      "Backend URL not configured. Please ensure backend is enabled in Rork platform."
    );
  }
  
  return baseUrl;
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      fetch: async (url, options) => {
        try {
          console.log('🌐 tRPC Request:', url);
          const response = await fetch(url, options);
          
          if (!response.ok) {
            const text = await response.text();
            console.error('❌ tRPC Response Error:', response.status, text.substring(0, 200));
            throw new Error(`Server error: ${response.status}`);
          }
          
          return response;
        } catch (error) {
          console.error('❌ tRPC Fetch Error:', error);
          throw error;
        }
      },
    }),
  ],
});
