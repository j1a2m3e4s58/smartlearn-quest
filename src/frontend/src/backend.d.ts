import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LeaderboardEntry {
    username: string;
    rank: bigint;
    achievedAt: Timestamp;
    score: bigint;
    playerPrincipal: Principal;
    accuracy: bigint;
}
export type Timestamp = bigint;
export type Result_2 = {
    __kind__: "ok";
    ok: UserProfileView;
} | {
    __kind__: "err";
    err: Error_;
};
export interface UpdateGameStateInput {
    status: SessionStatus;
    gameState: string;
    sessionId: string;
}
export interface ProgressUpdate {
    playTimeSeconds: bigint;
    dateString: string;
    coinsEarned: bigint;
    xpEarned: bigint;
}
export interface PersonalBest {
    timeSpent: bigint;
    achievedAt: Timestamp;
    gameId: string;
    score: bigint;
    accuracy: bigint;
}
export interface HubProgress {
    totalMissions: bigint;
    hubId: string;
    lastUpdated: bigint;
    unlocked: boolean;
    completionPercent: bigint;
    missionsCompleted: bigint;
}
export type Error_ = {
    __kind__: "sessionFull";
    sessionFull: null;
} | {
    __kind__: "alreadyExists";
    alreadyExists: null;
} | {
    __kind__: "invalidInput";
    invalidInput: string;
} | {
    __kind__: "notFound";
    notFound: null;
} | {
    __kind__: "unauthorized";
    unauthorized: null;
} | {
    __kind__: "sessionNotFound";
    sessionNotFound: null;
};
export interface ScoreInput {
    timeSpent: bigint;
    gameId: string;
    score: bigint;
    accuracy: bigint;
}
export type Result_1 = {
    __kind__: "ok";
    ok: HubProgress;
} | {
    __kind__: "err";
    err: Error_;
};
export interface ProgressionView {
    xp: bigint;
    lastPlayedDate: string;
    unlockedAchievements: Array<string>;
    coins: bigint;
    totalPlayTime: bigint;
    currentLevel: bigint;
    dailyStreak: bigint;
}
export type Result_4 = {
    __kind__: "ok";
    ok: ProgressionView;
} | {
    __kind__: "err";
    err: Error_;
};
export interface ScoreRecord {
    completedAt: Timestamp;
    timeSpent: bigint;
    gameId: string;
    score: bigint;
    accuracy: bigint;
}
export interface HubProgressUpdate {
    totalMissions: bigint;
    hubId: string;
    unlocked: boolean;
    missionsCompleted: bigint;
}
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export type Result_3 = {
    __kind__: "ok";
    ok: SessionView;
} | {
    __kind__: "err";
    err: Error_;
};
export interface CreateSessionInput {
    gameName: string;
    maxParticipants: bigint;
}
export interface UserProfileView {
    username: string;
    createdAt: Timestamp;
    role: UserRole;
    gradeLevel?: GradeLevel;
}
export interface SubjectSummary {
    completedHubs: bigint;
    overallPercent: bigint;
    totalHubs: bigint;
    subjectId: string;
}
export interface RegisterInput {
    username: string;
    role: UserRole;
    gradeLevel?: GradeLevel;
}
export interface SessionView {
    status: SessionStatus;
    participants: Array<Principal>;
    createdAt: Timestamp;
    hostPrincipal: Principal;
    gameName: string;
    gameState: string;
    sessionId: string;
    maxParticipants: bigint;
}
export interface UserProfile {
    username: string;
    createdAt: Timestamp;
    role: UserRole;
    gradeLevel?: GradeLevel;
}
export enum GradeLevel {
    basic1 = "basic1",
    basic2 = "basic2",
    basic3 = "basic3",
    basic4 = "basic4",
    basic5 = "basic5",
    basic6 = "basic6",
    basic7 = "basic7",
    basic8 = "basic8",
    basic9 = "basic9"
}
export enum SessionStatus {
    active = "active",
    completed = "completed",
    waiting = "waiting"
}
export enum UserRole {
    admin = "admin",
    teacher = "teacher",
    student = "student",
    parent = "parent"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    applyProgressUpdate(update: ProgressUpdate): Promise<Result_4>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    createSession(input: CreateSessionInput): Promise<Result_3>;
    getAllHubProgress(): Promise<Array<HubProgress>>;
    getCallerUserProfile(): Promise<UserProfileView | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getHubProgress(hubId: string): Promise<HubProgress | null>;
    getMyPersonalBest(gameId: string): Promise<PersonalBest | null>;
    getMyProfile(): Promise<UserProfileView | null>;
    getMyProgression(): Promise<ProgressionView | null>;
    getMyRecentScores(): Promise<Array<ScoreRecord>>;
    getSession(sessionId: string): Promise<SessionView | null>;
    getSubjectSummary(subjectId: string): Promise<SubjectSummary>;
    getTopScores(gameId: string): Promise<Array<LeaderboardEntry>>;
    getUserProfile(principal: Principal): Promise<Result_2>;
    getUserProgression(principal: Principal): Promise<Result_4>;
    getWeeklyScores(gameId: string, weekKey: string): Promise<Array<LeaderboardEntry>>;
    isCallerAdmin(): Promise<boolean>;
    joinSession(sessionId: string): Promise<Result_3>;
    leaveSession(sessionId: string): Promise<Result>;
    listWaitingSessions(gameName: string): Promise<Array<SessionView>>;
    recordScore(input: ScoreInput): Promise<Result>;
    registerProfile(input: RegisterInput): Promise<Result_2>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    unlockAchievement(achievementId: string): Promise<Result>;
    updateGameState(input: UpdateGameStateInput): Promise<Result>;
    updateHubProgress(update: HubProgressUpdate): Promise<Result_1>;
    updateUsername(newUsername: string): Promise<Result>;
}
