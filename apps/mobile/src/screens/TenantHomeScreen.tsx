import { UnlockPropertyResultDto } from "@repo/types";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { fetchNearbyProperties } from "../api/search";
import { unlockProperty } from "../api/subscriptions";
import { PropertyCard } from "../components/PropertyCard";
import { useAuthStore } from "../stores/useAuthStore";

type UnlockUiState =
  | { status: "idle" | "loading" }
  | { status: "success"; result: UnlockPropertyResultDto }
  | { status: "error"; error: string };

export function TenantHomeScreen() {
  const { token, clearSession } = useAuthStore();
  const [unlockStates, setUnlockStates] = useState<Record<string, UnlockUiState>>({});
  const [lat, setLat] = useState("0.3476");
  const [lng, setLng] = useState("32.5825");
  const [radius, setRadius] = useState("5000");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [radiusUsed, setRadiusUsed] = useState<number | null>(null);
  const [properties, setProperties] = useState<
    Array<{ id: string; title: string; rent_amount: number }>
  >([]);

  const sessionLabel = useMemo(
    () => `Session token: ${token?.slice(0, 14)}...`,
    [token]
  );

  async function loadSearchResults() {
    const latNum = Number(lat);
    const lngNum = Number(lng);
    const radiusNum = Number(radius);
    if (!Number.isFinite(latNum) || !Number.isFinite(lngNum) || !Number.isFinite(radiusNum)) {
      setSearchError("Lat/Lng/Radius must be valid numbers.");
      return;
    }

    setSearchLoading(true);
    setSearchError(null);
    try {
      const response = await fetchNearbyProperties({
        lat: latNum,
        lng: lngNum,
        radius: radiusNum
      });
      setRadiusUsed(response.radiusUsedMeters);
      setProperties(response.items);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : "Search request failed.");
      setProperties([]);
      setRadiusUsed(null);
    } finally {
      setSearchLoading(false);
    }
  }

  useEffect(() => {
    void loadSearchResults();
  }, []);

  async function onUnlock(propertyId: string) {
    if (!token) {
      setUnlockStates((prev) => ({
        ...prev,
        [propertyId]: {
          status: "error",
          error: "Please sign in to unlock landlord contacts."
        }
      }));
      return;
    }

    setUnlockStates((prev) => ({
      ...prev,
      [propertyId]: { status: "loading" }
    }));

    try {
      const result = await unlockProperty(propertyId);
      setUnlockStates((prev) => ({
        ...prev,
        [propertyId]: { status: "success", result }
      }));
    } catch (error) {
      setUnlockStates((prev) => ({
        ...prev,
        [propertyId]: {
          status: "error",
          error: error instanceof Error ? error.message : "Unlock request failed."
        }
      }));
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.sessionBox}>
        <Text style={styles.sessionTitle}>Tenant Session</Text>
        <Text style={styles.sessionLabel}>{sessionLabel}</Text>
        <Pressable style={styles.secondaryButton} onPress={clearSession}>
          <Text style={styles.secondaryButtonText}>Sign Out</Text>
        </Pressable>
      </View>

      <View style={styles.sessionBox}>
        <Text style={styles.sessionTitle}>Nearby Search</Text>
        <TextInput
          style={styles.input}
          value={lat}
          onChangeText={setLat}
          placeholder="Latitude"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={lng}
          onChangeText={setLng}
          placeholder="Longitude"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={radius}
          onChangeText={setRadius}
          placeholder="Radius (meters)"
          keyboardType="numeric"
        />
        <Pressable style={styles.primaryButton} onPress={() => void loadSearchResults()}>
          <Text style={styles.primaryButtonText}>Refresh Search</Text>
        </Pressable>
        {radiusUsed !== null ? (
          <Text style={styles.radiusInfo}>Server radius used: {radiusUsed}m</Text>
        ) : null}
        {searchError ? <Text style={styles.errorText}>{searchError}</Text> : null}
      </View>

      {searchLoading ? <ActivityIndicator style={styles.loader} size="small" /> : null}

      {!searchLoading && properties.length === 0 && !searchError ? (
        <Text style={styles.emptyText}>No properties found for this area.</Text>
      ) : null}

      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          propertyId={property.id}
          title={property.title}
          rent_amount={property.rent_amount}
          onUnlock={onUnlock}
          unlockState={unlockStates[property.id] ?? { status: "idle" }}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 28
  },
  sessionBox: {
    marginBottom: 14,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dfe6e3",
    padding: 12
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
  sessionTitle: {
    fontSize: 16,
    fontWeight: "700"
  },
  sessionLabel: {
    marginTop: 6,
    marginBottom: 8,
    color: "#4e5d58"
  },
  secondaryButton: {
    alignSelf: "flex-start",
    borderRadius: 10,
    backgroundColor: "#eceff1",
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  secondaryButtonText: {
    textAlign: "center",
    color: "#263238",
    fontWeight: "600"
  },
  loader: {
    marginTop: 6
  },
  radiusInfo: {
    marginTop: 8,
    color: "#465a52"
  },
  emptyText: {
    marginTop: 8,
    color: "#465a52"
  },
  errorText: {
    marginTop: 8,
    color: "#b71c1c"
  }
});
