import Map "mo:core/Map";
import Queue "mo:core/Queue";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import ScoreTypes "../types/scores";
import LeaderboardTypes "../types/leaderboard";
import CommonTypes "../types/common";

module {
  type Score = ScoreTypes.ScoreRecord;
  type Best = ScoreTypes.PersonalBest;
  type Input = ScoreTypes.ScoreInput;
  type Entry = LeaderboardTypes.LeaderboardEntry;
  type Error = CommonTypes.Error;

  public func recordScore(
    recentScores : Map.Map<Principal, Queue.Queue<Score>>,
    personalBests : Map.Map<Text, Best>,
    caller : Principal,
    input : Input,
    now : CommonTypes.Timestamp,
  ) : CommonTypes.Result<(), Error> {
    let record : Score = {
      gameId = input.gameId;
      score = input.score;
      accuracy = input.accuracy;
      timeSpent = input.timeSpent;
      completedAt = now;
    };
    let q = switch (recentScores.get(caller)) {
      case (?existing) { existing };
      case null { Queue.empty<Score>() };
    };
    if (q.size() >= 20) {
      ignore q.popFront();
    };
    q.pushBack(record);
    recentScores.add(caller, q);
    let key = personalBestKey(caller, input.gameId);
    switch (personalBests.get(key)) {
      case null {
        personalBests.add(key, {
          gameId = input.gameId;
          score = input.score;
          accuracy = input.accuracy;
          timeSpent = input.timeSpent;
          achievedAt = now;
        });
      };
      case (?pb) {
        if (input.score > pb.score) {
          personalBests.add(key, {
            gameId = input.gameId;
            score = input.score;
            accuracy = input.accuracy;
            timeSpent = input.timeSpent;
            achievedAt = now;
          });
        };
      };
    };
    #ok(());
  };

  public func getRecentScores(
    recentScores : Map.Map<Principal, Queue.Queue<Score>>,
    principal : Principal,
  ) : [Score] {
    switch (recentScores.get(principal)) {
      case null { [] };
      case (?q) { q.toArray() };
    };
  };

  public func getPersonalBest(
    personalBests : Map.Map<Text, Best>,
    principal : Principal,
    gameId : Text,
  ) : ?Best {
    personalBests.get(personalBestKey(principal, gameId));
  };

  public func personalBestKey(principal : Principal, gameId : Text) : Text {
    principal.toText() # ":" # gameId;
  };

  public func upsertLeaderboard(
    leaderboard : Map.Map<Text, List.List<Entry>>,
    key : Text,
    entry : Entry,
    limit : Nat,
  ) {
    let existing = switch (leaderboard.get(key)) {
      case (?l) { l.toArray() };
      case null { [] };
    };
    let filtered = existing.filter(func(e : Entry) : Bool {
      not Principal.equal(e.playerPrincipal, entry.playerPrincipal);
    });
    let combined = filtered.concat([entry]);
    let sorted = combined.sort(func(a : Entry, b : Entry) : { #less; #equal; #greater } {
      if (a.score > b.score) { #less } else if (a.score < b.score) { #greater } else { #equal };
    });
    let top = if (sorted.size() > limit) {
      sorted.sliceToArray(0, limit);
    } else { sorted };
    let ranked = top.mapEntries(func(e : Entry, i : Nat) : Entry {
      { e with rank = i + 1 };
    });
    leaderboard.add(key, List.fromArray<Entry>(ranked));
  };

  public func leaderboardKey(gameId : Text) : Text { "lb:" # gameId };
  public func weeklyKey(weekKey : Text, gameId : Text) : Text { "wk:" # weekKey # ":" # gameId };
}
