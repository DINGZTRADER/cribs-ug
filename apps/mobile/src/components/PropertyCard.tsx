import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { UnlockPropertyResultDto } from "@repo/types";

type PropertyCardProps = {
  propertyId: string;
  title: string;
  rent_amount: number;
  onUnlock: (propertyId: string) => void;
  unlockState:
    | {
        status: "idle" | "loading";
      }
    | {
        status: "success";
        result: UnlockPropertyResultDto;
      }
    | {
        status: "error";
        error: string;
      };
};

export function PropertyCard({
  propertyId,
  title,
  rent_amount,
  onUnlock,
  unlockState
}: PropertyCardProps) {
  const unlockButtonDisabled = unlockState.status === "loading";

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.rent}>UGX {rent_amount.toLocaleString()}</Text>
      {unlockState.status === "success" && unlockState.result.allowed ? (
        <View style={styles.resultBoxSuccess}>
          <Text style={styles.resultTitle}>Contact Unlocked</Text>
          <Text style={styles.resultText}>
            {unlockState.result.landlordName} - {unlockState.result.landlordPhone}
          </Text>
          {unlockState.result.safetyWarning ? (
            <Text style={styles.safetyWarning}>{unlockState.result.safetyWarning}</Text>
          ) : null}
        </View>
      ) : null}

      {unlockState.status === "success" && !unlockState.result.allowed ? (
        <View style={styles.resultBoxLocked}>
          <Text style={styles.resultTitle}>Contact Locked</Text>
          <Text style={styles.resultText}>
            {unlockState.result.message || "Upgrade required to reveal contact."}
          </Text>
          {unlockState.result.upsell?.recommendedTier ? (
            <Text style={styles.upsellText}>
              Recommended plan: {unlockState.result.upsell.recommendedTier}
            </Text>
          ) : null}
        </View>
      ) : null}

      {unlockState.status === "error" ? (
        <View style={styles.resultBoxError}>
          <Text style={styles.errorText}>{unlockState.error}</Text>
        </View>
      ) : null}

      <Pressable
        style={[styles.unlockButton, unlockButtonDisabled && styles.unlockButtonDisabled]}
        onPress={() => onUnlock(propertyId)}
        disabled={unlockButtonDisabled}
      >
        <Text style={styles.unlockButtonText}>
          {unlockState.status === "loading" ? "Unlocking..." : "Show Landlord Contact"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#ffffff"
  },
  title: {
    fontSize: 16,
    fontWeight: "600"
  },
  rent: {
    marginTop: 6,
    fontSize: 14,
    color: "#4a4a4a"
  },
  unlockButton: {
    marginTop: 12,
    borderRadius: 10,
    backgroundColor: "#1b5e20",
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  unlockButtonDisabled: {
    opacity: 0.6
  },
  unlockButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    textAlign: "center"
  },
  resultBoxSuccess: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#e8f5e9"
  },
  resultBoxLocked: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff8e1"
  },
  resultBoxError: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#ffebee"
  },
  resultTitle: {
    fontWeight: "700"
  },
  resultText: {
    marginTop: 4,
    color: "#333333"
  },
  upsellText: {
    marginTop: 6,
    fontWeight: "600",
    color: "#6d4c41"
  },
  safetyWarning: {
    marginTop: 8,
    fontSize: 12,
    color: "#2e7d32"
  },
  errorText: {
    color: "#b71c1c"
  }
});
