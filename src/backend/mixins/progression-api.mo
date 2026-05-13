import Principal "mo:core/Principal";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/progression";
import CommonTypes "../types/common";
import ProgressionLib "../lib/progression";

mixin (
  accessControlState : AccessControl.AccessControlState,
  progressions : Map.Map<Principal, Types.Progression>,
  achievements : Map.Map<Principal, List.List<Types.Achievement>>,
) {
  /// Get caller's full progression view
  public query ({ caller }) func getMyProgression() : async ?Types.ProgressionView {
    ProgressionLib.getView(progressions, achievements, caller);
  };

  /// Apply a progress update for the caller
  public shared ({ caller }) func applyProgressUpdate(
    update : Types.ProgressUpdate
  ) : async CommonTypes.Result<Types.ProgressionView, CommonTypes.Error> {
    ProgressionLib.applyUpdate(progressions, achievements, caller, update);
  };

  /// Unlock an achievement for the caller
  public shared ({ caller }) func unlockAchievement(
    achievementId : Text
  ) : async CommonTypes.Result<(), CommonTypes.Error> {
    ProgressionLib.unlockAchievement(achievements, caller, achievementId, Time.now());
  };

  /// Admin: get any user's progression
  public query ({ caller }) func getUserProgression(
    principal : Principal
  ) : async CommonTypes.Result<Types.ProgressionView, CommonTypes.Error> {
    switch (ProgressionLib.getView(progressions, achievements, principal)) {
      case (?view) { #ok(view) };
      case null { #err(#notFound) };
    };
  };
}
