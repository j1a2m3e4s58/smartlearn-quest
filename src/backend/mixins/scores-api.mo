import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Queue "mo:core/Queue";
import List "mo:core/List";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import ScoreTypes "../types/scores";
import LeaderboardTypes "../types/leaderboard";
import CommonTypes "../types/common";
import ScoresLib "../lib/scores";
import LeaderboardLib "../lib/leaderboard";

mixin (
  accessControlState : AccessControl.AccessControlState,
  recentScores : Map.Map<Principal, Queue.Queue<ScoreTypes.ScoreRecord>>,
  personalBests : Map.Map<Text, ScoreTypes.PersonalBest>,
  globalLeaderboard : Map.Map<Text, List.List<LeaderboardTypes.LeaderboardEntry>>,
  weeklyLeaderboard : Map.Map<Text, List.List<LeaderboardTypes.LeaderboardEntry>>,
) {
  /// Record a game score for the caller
  public shared ({ caller }) func recordScore(
    input : ScoreTypes.ScoreInput
  ) : async CommonTypes.Result<(), CommonTypes.Error> {
    ScoresLib.recordScore(recentScores, personalBests, caller, input, Time.now());
  };

  /// Get caller's recent scores (up to 20)
  public query ({ caller }) func getMyRecentScores() : async [ScoreTypes.ScoreRecord] {
    ScoresLib.getRecentScores(recentScores, caller);
  };

  /// Get caller's personal best for a game
  public query ({ caller }) func getMyPersonalBest(
    gameId : Text
  ) : async ?ScoreTypes.PersonalBest {
    ScoresLib.getPersonalBest(personalBests, caller, gameId);
  };

  /// Get global top 10 scores for a game
  public query ({ caller }) func getTopScores(
    gameId : Text
  ) : async [LeaderboardTypes.LeaderboardEntry] {
    LeaderboardLib.getScores(globalLeaderboard, LeaderboardLib.leaderboardKey(gameId), 10);
  };

  /// Get weekly leaderboard for a game and week key
  public query ({ caller }) func getWeeklyScores(
    gameId : Text,
    weekKey : Text,
  ) : async [LeaderboardTypes.LeaderboardEntry] {
    LeaderboardLib.getScores(weeklyLeaderboard, LeaderboardLib.weeklyKey(weekKey, gameId), 10);
  };
}
