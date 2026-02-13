import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { AuthStack } from "./src/navigation/AuthStack";
import { TenantStack } from "./src/navigation/TenantStack";
import { useAuthStore } from "./src/stores/useAuthStore";

export default function App() {
  const { token } = useAuthStore();
  const isAuthenticated = Boolean(token?.trim());

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.appTitle}>Crib-UG</Text>
      {isAuthenticated ? <TenantStack /> : <AuthStack />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f8f7"
  },
  appTitle: {
    marginTop: 8,
    marginHorizontal: 16,
    fontSize: 24,
    fontWeight: "700",
    color: "#102a21"
  }
});
