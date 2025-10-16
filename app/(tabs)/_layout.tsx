import { Tabs } from "expo-router";
import { Calendar, Home, Settings, Users } from "lucide-react-native";
import React from "react";
import { useTema } from '@/hooks/useTema';

export default function TabLayout() {
  const { colores } = useTema();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colores.primary,
        tabBarInactiveTintColor: colores.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colores.card,
          borderTopColor: colores.border,
        },
      }}
    >
      <Tabs.Screen
        name="calendario"
        options={{
          title: "Calendario",
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="hoy"
        options={{
          title: "Hoy",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="amigos"
        options={{
          title: "Amigos",
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ajustes"
        options={{
          title: "Ajustes",
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
