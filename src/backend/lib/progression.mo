import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import ProgressionTypes "../types/progression";
import CommonTypes "../types/common";

module {
  type Progression = ProgressionTypes.Progression;
  type View = ProgressionTypes.ProgressionView;
  type Update = ProgressionTypes.ProgressUpdate;
  type Achievement = ProgressionTypes.Achievement;
  type Error = CommonTypes.Error;

  public func getOrCreate(
    progressions : Map.Map<Principal, Progression>,
    principal : Principal,
  ) : Progression {
    switch (progressions.get(principal)) {
      case (?p) { p };
      case null {
        let p : Progression = {
          var xp = 0;
          var coins = 0;
          var currentLevel = 1;
          var dailyStreak = 0;
          var lastPlayedDate = "";
          var totalPlayTime = 0;
        };
        progressions.add(principal, p);
        p;
      };
    };
  };

  public func applyUpdate(
    progressions : Map.Map<Principal, Progression>,
    achievements : Map.Map<Principal, List.List<Achievement>>,
    caller : Principal,
    update : Update,
  ) : CommonTypes.Result<View, Error> {
    let p = getOrCreate(progressions, caller);
    p.xp += update.xpEarned;
    p.coins += update.coinsEarned;
    p.totalPlayTime += update.playTimeSeconds;
    p.currentLevel := calcLevel(p.xp);
    if (p.lastPlayedDate == "") {
      p.dailyStreak := 1;
      p.lastPlayedDate := update.dateString;
    } else if (p.lastPlayedDate == update.dateString) {
      ();
    } else {
      p.dailyStreak += 1;
      p.lastPlayedDate := update.dateString;
    };
    let ids = achievementIds(achievements, caller);
    #ok({
      xp = p.xp;
      coins = p.coins;
      currentLevel = p.currentLevel;
      dailyStreak = p.dailyStreak;
      lastPlayedDate = p.lastPlayedDate;
      totalPlayTime = p.totalPlayTime;
      unlockedAchievements = ids;
    });
  };

  public func unlockAchievement(
    achievements : Map.Map<Principal, List.List<Achievement>>,
    caller : Principal,
    achievementId : Text,
    now : CommonTypes.Timestamp,
  ) : CommonTypes.Result<(), Error> {
    let existing = switch (achievements.get(caller)) {
      case (?l) { l };
      case null { List.empty<Achievement>() };
    };
    let alreadyHas = existing.find(func(a : Achievement) : Bool {
      a.achievementId == achievementId;
    });
    switch (alreadyHas) {
      case (?_) { #err(#alreadyExists) };
      case null {
        let newAch : Achievement = { achievementId = achievementId; unlockedAt = now };
        existing.add(newAch);
        achievements.add(caller, existing);
        #ok(());
      };
    };
  };

  public func getView(
    progressions : Map.Map<Principal, Progression>,
    achievements : Map.Map<Principal, List.List<Achievement>>,
    principal : Principal,
  ) : ?View {
    switch (progressions.get(principal)) {
      case null { null };
      case (?p) {
        let ids = achievementIds(achievements, principal);
        ?{
          xp = p.xp;
          coins = p.coins;
          currentLevel = p.currentLevel;
          dailyStreak = p.dailyStreak;
          lastPlayedDate = p.lastPlayedDate;
          totalPlayTime = p.totalPlayTime;
          unlockedAchievements = ids;
        };
      };
    };
  };

  public func calcLevel(xp : Nat) : Nat {
    let lvl = Int.abs(Float.sqrt(xp.toFloat() / 50.0).toInt()) + 1;
    if (lvl > 50) { 50 } else { lvl };
  };

  func achievementIds(
    achievements : Map.Map<Principal, List.List<Achievement>>,
    principal : Principal,
  ) : [Text] {
    switch (achievements.get(principal)) {
      case null { [] };
      case (?l) {
        l.toArray().map<Achievement, Text>(func(a : Achievement) : Text { a.achievementId });
      };
    };
  };
}
