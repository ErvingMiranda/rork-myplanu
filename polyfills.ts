import { Platform } from 'react-native';

if (Platform.OS === 'android') {
  const originalRequire = global.require;
  
  global.require = function(modulePath: string) {
    if (modulePath && typeof modulePath === 'string' && 
        modulePath.includes('react-native/src/private/inspector')) {
      console.log('[Polyfill] Intercepted inspector module request, returning mock');
      return {
        getInspectorDataForViewAtPoint: () => null,
      };
    }
    return originalRequire(modulePath);
  } as any;
}
