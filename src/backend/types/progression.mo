import CommonTypes "common";

module {
  /// Core progression state per user
  public type Progression = {
    var xp : Nat;
    var coins : Nat;
    var currentLevel : Nat;       // 1–50
    var dailyStreak : Nat;
    var lastPlayedDate : Text;    // ISO date string "YYYY-MM-DD"
    var totalPlayTime : Nat;      // seconds
  };

  /// Immutable view of progression (for API responses)
  public type ProgressionView = {
    xp : Nat;
    coins : Nat;
    currentLevel : Nat;
    dailyStreak : Nat;
    lastPlayedDate : Text;
    totalPlayTime : Nat;
    unlockedAchievements : [Text];
  };

  /// Achievement record
  public type Achievement = {
    achievementId : Text;
    unlockedAt : CommonTypes.Timestamp;
  };

  /// Input to award XP and coins after gameplay
  public type ProgressUpdate = {
    xpEarned : Nat;
    coinsEarned : Nat;
    playTimeSeconds : Nat;
    dateString : Text;            // "YYYY-MM-DD" for streak tracking
  };
}
