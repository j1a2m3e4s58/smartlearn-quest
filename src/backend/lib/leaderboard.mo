import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import LeaderboardTypes "../types/leaderboard";

module {
  type Entry = LeaderboardTypes.LeaderboardEntry;

  public func upsertScore(
    board : Map.Map<Text, List.List<Entry>>,
    key : Text,
    entry : Entry,
    limit : Nat,
  ) {
    let existing = switch (board.get(key)) {
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
    let top = if (sorted.size() > limit) { sorted.sliceToArray(0, limit) } else { sorted };
    let ranked = top.mapEntries(func(e : Entry, i : Nat) : Entry {
      { e with rank = i + 1 };
    });
    board.add(key, List.fromArray<Entry>(ranked));
  };

  public func getScores(
    board : Map.Map<Text, List.List<Entry>>,
    key : Text,
    limit : Nat,
  ) : [Entry] {
    switch (board.get(key)) {
      case null { [] };
      case (?l) {
        let all = l.toArray();
        if (limit >= all.size()) { all } else { all.sliceToArray(0, limit) };
      };
    };
  };

  public func leaderboardKey(gameId : Text) : Text { "lb:" # gameId };
  public func weeklyKey(weekKey : Text, gameId : Text) : Text { "wk:" # weekKey # ":" # gameId };
}
