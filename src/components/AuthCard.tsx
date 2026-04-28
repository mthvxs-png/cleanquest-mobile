import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Card } from "./Card";
import { PrimaryButton } from "./PrimaryButton";
import { signInWithGoogleIdToken, signOutCurrentUser } from "../services/auth";
import { missingFirebaseConfigKeys } from "../services/firebase";
import { theme } from "../theme/tokens";
import { useGameStore } from "../store/useGameStore";
import { useShallow } from "zustand/react/shallow";

WebBrowser.maybeCompleteAuthSession();

interface AuthCardProps {
  mode: "compact" | "full";
}

export const AuthCard = ({ mode }: AuthCardProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { authState, setAuthError } = useGameStore(
    useShallow((state) => ({
      authState: state.authState,
      setAuthError: state.setAuthError,
    })),
  );

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "",
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    scopes: ["profile", "email"],
    responseType: "id_token",
  });

  useEffect(() => {
    const idToken = response?.type === "success" ? response.params.id_token : undefined;

    if (!idToken) {
      return;
    }

    void signInWithGoogleIdToken(idToken).catch((error) => {
      setAuthError(error instanceof Error ? error.message : "Google sign-in failed.");
    });
  }, [response, setAuthError]);

  const missingKeysLabel = useMemo(() => missingFirebaseConfigKeys.join(", "), []);

  if (!authState.firebaseConfigured) {
    return (
      <Card>
        <Text style={styles.title}>{t("auth.firebaseNotConfigured")}</Text>
        <Text style={styles.description}>{t("auth.firebaseMissingKeys", { keys: missingKeysLabel })}</Text>
      </Card>
    );
  }

  if (authState.status === "signedIn" && authState.user) {
    return (
      <Card>
        <Text style={styles.title}>{t("auth.connected")}</Text>
        <Text style={styles.description}>{authState.user.displayName ?? authState.user.email ?? authState.user.uid}</Text>
        <Text style={styles.meta}>{t("auth.syncStatus", { status: authState.remoteLoaded ? t("auth.synced") : t("auth.syncing") })}</Text>
        <PrimaryButton label={t("auth.signOut")} onPress={() => void signOutCurrentUser()} tone="secondary" />
      </Card>
    );
  }

  return (
    <Card>
      <Text style={styles.title}>{t("auth.signInTitle")}</Text>
      <Text style={styles.description}>
        {mode === "full" ? t("auth.signInDescription") : t("auth.signInCompact")}
      </Text>
      <PrimaryButton
        label={t("auth.signInWithGoogle")}
        onPress={() => {
          void promptAsync();
        }}
        disabled={!request || authState.status === "checking"}
      />
      {authState.error ? <Text style={styles.error}>{authState.error}</Text> : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: theme.spacing.xs,
  },
  description: {
    color: theme.colors.textMuted,
    fontSize: 14,
    marginBottom: theme.spacing.sm,
  },
  meta: {
    color: theme.colors.textMuted,
    fontSize: 13,
    marginBottom: theme.spacing.sm,
  },
  error: {
    color: theme.colors.primary,
    marginTop: theme.spacing.sm,
    fontWeight: "700",
  },
});
