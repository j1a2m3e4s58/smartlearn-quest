import Map "mo:core/Map";
import List "mo:core/List";
import Queue "mo:core/Queue";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import UserTypes "types/user";
import ProgressionTypes "types/progression";
import ScoreTypes "types/scores";
import HubTypes "types/hubs";
import SessionTypes "types/sessions";
import LeaderboardTypes "types/leaderboard";
import UserApiMixin "mixins/user-api";
import ProgressionApiMixin "mixins/progression-api";
import ScoresApiMixin "mixins/scores-api";
import HubsApiMixin "mixins/hubs-api";
import SessionsApiMixin "mixins/sessions-api";

actor {
  // --- Authorization state ---
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // --- User profiles ---
  let userProfiles = Map.empty<Principal, UserTypes.UserProfile>();
  include UserApiMixin(accessControlState, userProfiles);

  // --- Progression ---
  let progressions = Map.empty<Principal, ProgressionTypes.Progression>();
  let achievements = Map.empty<Principal, List.List<ProgressionTypes.Achievement>>();
  include ProgressionApiMixin(accessControlState, progressions, achievements);

  // --- Scores and leaderboards ---
  let recentScores = Map.empty<Principal, Queue.Queue<ScoreTypes.ScoreRecord>>();
  let personalBests = Map.empty<Text, ScoreTypes.PersonalBest>();
  let globalLeaderboard = Map.empty<Text, List.List<LeaderboardTypes.LeaderboardEntry>>();
  let weeklyLeaderboard = Map.empty<Text, List.List<LeaderboardTypes.LeaderboardEntry>>();
  include ScoresApiMixin(
    accessControlState,
    recentScores,
    personalBests,
    globalLeaderboard,
    weeklyLeaderboard,
  );

  // --- Hub progress ---
  let hubProgress = Map.empty<Text, HubTypes.HubProgress>();
  include HubsApiMixin(accessControlState, hubProgress);

  // --- Multiplayer sessions ---
  let sessions = Map.empty<Text, SessionTypes.Session>();
  let sessionState = { var nextSessionId = 0 };
  include SessionsApiMixin(accessControlState, sessions, sessionState);
};
