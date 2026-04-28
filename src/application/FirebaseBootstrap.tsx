import React, { useEffect, useMemo } from "react";
import { loadUserProgress, saveUserProgress, toPersistedProgress } from "../services/progress";
import { isFirebaseConfigured } from "../services/firebase";
import { subscribeToAuthState } from "../services/auth";
import { useGameStore } from "../store/useGameStore";
import { useShallow } from "zustand/react/shallow";

export const FirebaseBootstrap = (): null => {
  const authState = useGameStore((state) => state.authState);
  const persistedSource = useGameStore(
    useShallow((state) => ({
      progression: state.progression,
      streak: state.streak,
      buffs: state.buffs,
      taskRuns: state.taskRuns,
      selectedTaskIds: state.selectedTaskIds,
      dailyMissions: state.dailyMissions,
      completedMissionIds: state.completedMissionIds,
      loginRewards: state.loginRewards,
      stats: state.stats,
      character: state.character,
      shop: state.shop,
    })),
  );
  const persistedSnapshot = useMemo(
    () =>
      toPersistedProgress({
        ...useGameStore.getState(),
        progression: persistedSource.progression,
        streak: persistedSource.streak,
        buffs: persistedSource.buffs,
        taskRuns: persistedSource.taskRuns,
        selectedTaskIds: persistedSource.selectedTaskIds,
        dailyMissions: persistedSource.dailyMissions,
        completedMissionIds: persistedSource.completedMissionIds,
        loginRewards: persistedSource.loginRewards,
        stats: persistedSource.stats,
        character: persistedSource.character,
        shop: persistedSource.shop,
      }),
    [persistedSource],
  );

  useEffect(() => {
    const store = useGameStore.getState();
    store.setFirebaseAvailability(isFirebaseConfigured);

    if (!isFirebaseConfigured) {
      store.markRemoteReady();
      return;
    }

    store.setAuthChecking();

    const unsubscribe = subscribeToAuthState(async (user) => {
      if (!user) {
        useGameStore.getState().setSignedOutUser();
        return;
      }

      useGameStore.getState().setSignedInUser({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });

      try {
        const remote = await loadUserProgress(user.uid);
        if (remote) {
          useGameStore.getState().hydrateRemoteProgress(remote);
        } else {
          await saveUserProgress(user.uid, toPersistedProgress(useGameStore.getState()));
          useGameStore.getState().markRemoteReady();
          useGameStore.getState().setLastSyncedAt(Date.now());
        }
      } catch (error) {
        useGameStore
          .getState()
          .setAuthError(error instanceof Error ? error.message : "Failed to load remote progress.");
        useGameStore.getState().markRemoteReady();
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authState.firebaseConfigured || authState.status !== "signedIn" || !authState.user || !authState.remoteLoaded) {
      return;
    }

    const currentUser = authState.user;

    const timeout = setTimeout(async () => {
      try {
        await saveUserProgress(currentUser.uid, persistedSnapshot);
        useGameStore.getState().setLastSyncedAt(Date.now());
      } catch (error) {
        useGameStore
          .getState()
          .setAuthError(error instanceof Error ? error.message : "Failed to save remote progress.");
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [authState.firebaseConfigured, authState.remoteLoaded, authState.status, authState.user, persistedSnapshot]);

  return null;
};
