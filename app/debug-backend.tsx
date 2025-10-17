import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTema } from '@/hooks/useTema';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function DebugBackendScreen() {
  const { colores } = useTema();
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const backendUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResult('Probando conexión...');
    
    try {
      const url = `${backendUrl}/api`;
      console.log('Testing URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      setTestResult(JSON.stringify({
        status: response.status,
        ok: response.ok,
        data: data
      }, null, 2));
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const testTrpcEndpoint = async () => {
    setLoading(true);
    setTestResult('Probando endpoint tRPC...');
    
    try {
      const url = `${backendUrl}/api/trpc`;
      console.log('Testing tRPC URL:', url);
      
      const response = await fetch(url);
      const text = await response.text();
      
      setTestResult(JSON.stringify({
        status: response.status,
        ok: response.ok,
        contentType: response.headers.get('content-type'),
        body: text.substring(0, 500)
      }, null, 2));
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colores.surface,
      paddingBottom: insets.bottom,
    },
    content: {
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    title: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colores.text,
      marginBottom: 12,
    },
    label: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colores.textSecondary,
      marginBottom: 4,
    },
    value: {
      fontSize: 14,
      color: colores.text,
      fontFamily: 'monospace' as const,
      backgroundColor: colores.card,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    resultCard: {
      padding: 16,
      marginBottom: 16,
    },
    result: {
      fontSize: 12,
      color: colores.text,
      fontFamily: 'monospace' as const,
      lineHeight: 18,
    },
    buttonContainer: {
      gap: 12,
    },
  });

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Debug Backend',
          headerBackTitle: 'Atrás',
        }}
      />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={styles.title}>Estado del Backend</Text>
            
            <Text style={styles.label}>EXPO_PUBLIC_RORK_API_BASE_URL:</Text>
            <Text style={styles.value}>
              {backendUrl || '❌ NO CONFIGURADO'}
            </Text>

            <Text style={styles.label}>Variables de entorno:</Text>
            <Text style={styles.value}>
              {Object.keys(process.env)
                .filter(k => k.includes('EXPO') || k.includes('RORK'))
                .join(', ') || 'Ninguna encontrada'}
            </Text>
          </View>

          {backendUrl && (
            <>
              <View style={styles.section}>
                <Text style={styles.title}>Pruebas de Conexión</Text>
                
                <View style={styles.buttonContainer}>
                  <Button
                    title="Probar /api"
                    onPress={testBackendConnection}
                    disabled={loading}
                  />
                  
                  <Button
                    title="Probar /api/trpc"
                    onPress={testTrpcEndpoint}
                    disabled={loading}
                  />
                </View>
              </View>

              {testResult && (
                <View style={styles.section}>
                  <Text style={styles.title}>Resultado:</Text>
                  <Card style={styles.resultCard}>
                    <ScrollView horizontal>
                      <Text style={styles.result}>{testResult}</Text>
                    </ScrollView>
                  </Card>
                </View>
              )}
            </>
          )}

          {!backendUrl && (
            <Card style={styles.resultCard}>
              <Text style={[styles.result, { color: '#FF3B30' }]}>
                ❌ INSTRUCCIONES PARA SOLUCIONAR:
                {'\n\n'}
                1. Detener el servidor actual (Ctrl+C)
                {'\n'}
                2. Verificar que existe la carpeta backend/ en tu proyecto
                {'\n'}
                3. Reiniciar con: bun start
                {'\n'}
                4. La plataforma Rork detectará automáticamente el backend
                {'\n\n'}
                Si el problema persiste, contacta soporte.
              </Text>
            </Card>
          )}
        </ScrollView>
      </View>
    </>
  );
}
