import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { login, register } from "../api/auth";
import { useAuthStore } from "../stores/useAuthStore";

export function AuthSessionScreen() {
  const { setSession } = useAuthStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setLoading(true);
    setError(null);
    try {
      if (mode === "register") {
        const session = await register({
          fullName,
          phone,
          email: email.trim() || undefined,
          password,
          role: "tenant"
        });
        setSession(session.accessToken, session.user.id, session.user.role);
      } else {
        const session = await login({
          phone,
          password
        });
        setSession(session.accessToken, session.user.id, session.user.role);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === "login" ? "Sign In" : "Create Account"}</Text>
      <Text style={styles.subtitle}>
        {mode === "login"
          ? "Use phone and password."
          : "Register as tenant to unlock subscriptions."}
      </Text>

      {mode === "register" ? (
        <TextInput
          style={styles.input}
          placeholder="Full name"
          value={fullName}
          onChangeText={setFullName}
        />
      ) : null}

      {mode === "register" ? (
        <TextInput
          style={styles.input}
          placeholder="Email (optional)"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Phone (e.g. +2567...)"
        keyboardType="phone-pad"
        autoCapitalize="none"
        autoCorrect={false}
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Pressable style={styles.primaryButton} onPress={() => void onSubmit()} disabled={loading}>
        <Text style={styles.primaryButtonText}>
          {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Register"}
        </Text>
      </Pressable>

      <Pressable
        style={styles.linkButton}
        onPress={() => setMode(mode === "login" ? "register" : "login")}
      >
        <Text style={styles.linkText}>
          {mode === "login" ? "Need an account? Register" : "Already have an account? Sign in"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dfe6e3",
    padding: 12
  },
  title: {
    fontSize: 18,
    fontWeight: "700"
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 8,
    color: "#4e5d58"
  },
  input: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ccd8d3",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    backgroundColor: "#fbfdfc"
  },
  primaryButton: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: "#145a32",
    paddingVertical: 10
  },
  primaryButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "700"
  },
  linkButton: {
    marginTop: 10
  },
  linkText: {
    color: "#145a32",
    fontWeight: "600"
  },
  errorText: {
    marginTop: 8,
    color: "#b71c1c"
  }
});
