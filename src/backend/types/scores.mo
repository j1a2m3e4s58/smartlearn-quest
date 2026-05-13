import CommonTypes "common";

module {
  /// A single game score record
  public type ScoreRecord = {
    gameId : Text;
    score : Nat;
    accuracy : Nat;               // 0–100 percent
    timeSpent : Nat;              // seconds
    completedAt : CommonTypes.Timestamp;
  };

  /// Personal best per game
  public type PersonalBest = {
    gameId : Text;
    score : Nat;
    accuracy : Nat;
    timeSpent : Nat;
    achievedAt : CommonTypes.Timestamp;
  };

  /// Input to record a new score
  public type ScoreInput = {
    gameId : Text;
    score : Nat;
    accuracy : Nat;
    timeSpent : Nat;
  };
}
