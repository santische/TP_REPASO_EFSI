import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Text } from 'react-native'

export default function Layout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: '#0a0a0a' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase' },
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          tabBarActiveTintColor: '#16a34a',
          tabBarInactiveTintColor: '#666',
          tabBarStyle: {
            backgroundColor: '#0a0a0a',
            borderTopColor: '#16a34a',
            borderTopWidth: 1,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '◆ POKÉDEX',
            tabBarLabel: 'Inicio',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20 }}>🏠</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="favoritos"
          options={{
            title: '◆ FAVORITOS',
            tabBarLabel: 'Favoritos',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20 }}>⭐</Text>
            ),
          }}
        />
      </Tabs>
    </>
  )
}
