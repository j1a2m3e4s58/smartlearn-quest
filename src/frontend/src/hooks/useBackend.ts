import { createActor } from "@/backend";
import type {
  HubProgressUpdate,
  ProgressUpdate,
  RegisterInput,
  ScoreInput,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useBackendActor() {
  return useActor(createActor);
}

export function useMyProfile() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyProgression() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["progression"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProgression();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllHubProgress() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["hubProgress"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllHubProgress();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyRecentScores() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["recentScores"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyRecentScores();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTopScores(gameId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["topScores", gameId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopScores(gameId);
    },
    enabled: !!actor && !isFetching && !!gameId,
  });
}

export function useMyPersonalBest(gameId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["personalBest", gameId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyPersonalBest(gameId);
    },
    enabled: !!actor && !isFetching && !!gameId,
  });
}

export function useMutateRegisterProfile() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.registerProfile(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useMutateRecordScore() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ScoreInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.recordScore(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recentScores"] });
      queryClient.invalidateQueries({ queryKey: ["progression"] });
    },
  });
}

export function useMutateApplyProgressUpdate() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (update: ProgressUpdate) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.applyProgressUpdate(update);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progression"] });
    },
  });
}

export function useMutateUpdateHubProgress() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (update: HubProgressUpdate) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateHubProgress(update);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hubProgress"] });
    },
  });
}
