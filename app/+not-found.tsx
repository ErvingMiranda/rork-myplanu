import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useTema } from '@/hooks/useTema';

export default function NotFoundScreen() {
  const { colores } = useTema();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      backgroundColor: colores.background,
    },
    title: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: colores.text,
      marginBottom: 8,
    },
    link: {
      marginTop: 15,
      paddingVertical: 15,
    },
    linkText: {
      fontSize: 14,
      color: colores.primary,
    },
  });

  return (
    <>
      <Stack.Screen options={{ title: "Página no encontrada" }} />
      <View style={styles.container}>
        <Text style={styles.title}>
          Esta pantalla no existe.
        </Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Ir al inicio</Text>
        </Link>
      </View>
    </>
  );
}
