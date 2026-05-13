import CommonTypes "common";

module {
  /// A single leaderboard entry
  public type LeaderboardEntry = {
    rank : Nat;
    playerPrincipal : Principal;
    username : Text;
    score : Nat;
    accuracy : Nat;
    achievedAt : CommonTypes.Timestamp;
  };

  /// Key for weekly leaderboard partitioning
  public type WeekKey = Text; // "YYYY-WW" format

  /// Composite key for per-game score records
  public type ScoreKey = {
    gameId : Text;
    playerPrincipal : Principal;
  };
}
