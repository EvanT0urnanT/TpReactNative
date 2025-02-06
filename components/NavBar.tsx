import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

const NavBar = () => {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar }}>

      <Tabs.Screen
        name="add"
        options={{
          tabBarLabel: "Ajouter",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" color={color} size={size} />
          ),
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
      <Tabs.Screen
        name="[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff', // Fond clair pour la barre de navigation
    borderTopWidth: 1,
    borderTopColor: '#e2e2e2', // Bordure subtile
    elevation: 5, // Ombre douce pour l'effet de profondeur
    paddingBottom: 5, // Espacement en bas
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7f8c8d', // Couleur subtile mais visible pour les étiquettes
  },
});

export default NavBar;
