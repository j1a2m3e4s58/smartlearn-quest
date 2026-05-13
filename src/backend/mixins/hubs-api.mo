import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import HubTypes "../types/hubs";
import CommonTypes "../types/common";
import HubsLib "../lib/hubs";

mixin (
  accessControlState : AccessControl.AccessControlState,
  hubProgress : Map.Map<Text, HubTypes.HubProgress>,
) {
  /// Get caller's progress for a specific hub
  public query ({ caller }) func getHubProgress(
    hubId : Text
  ) : async ?HubTypes.HubProgress {
    HubsLib.getHubProgress(hubProgress, caller, hubId);
  };

  /// Get all hub progress entries for the caller
  public query ({ caller }) func getAllHubProgress() : async [HubTypes.HubProgress] {
    HubsLib.getAllHubProgress(hubProgress, caller);
  };

  /// Update hub progress for the caller
  public shared ({ caller }) func updateHubProgress(
    update : HubTypes.HubProgressUpdate
  ) : async CommonTypes.Result<HubTypes.HubProgress, CommonTypes.Error> {
    HubsLib.updateHubProgress(hubProgress, caller, update, Time.now());
  };

  /// Get subject-level summary for a subject
  public query ({ caller }) func getSubjectSummary(
    subjectId : Text
  ) : async HubTypes.SubjectSummary {
    HubsLib.getSubjectSummary(hubProgress, caller, subjectId);
  };
}
