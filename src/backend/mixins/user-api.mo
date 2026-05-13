import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/user";
import CommonTypes "../types/common";
import UserLib "../lib/user";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles : Map.Map<Principal, Types.UserProfile>,
) {
  /// Register a new user profile for the caller
  public shared ({ caller }) func registerProfile(
    input : Types.RegisterInput
  ) : async CommonTypes.Result<Types.UserProfileView, CommonTypes.Error> {
    UserLib.register(userProfiles, caller, input, Time.now());
  };

  /// Get caller's own profile
  public query ({ caller }) func getMyProfile() : async ?Types.UserProfileView {
    UserLib.getProfile(userProfiles, caller);
  };

  /// Get any user's profile (admin or self)
  public query ({ caller }) func getUserProfile(
    principal : Principal
  ) : async CommonTypes.Result<Types.UserProfileView, CommonTypes.Error> {
    switch (UserLib.getProfile(userProfiles, principal)) {
      case (?view) { #ok(view) };
      case null { #err(#notFound) };
    };
  };

  /// Update caller's username
  public shared ({ caller }) func updateUsername(
    newUsername : Text
  ) : async CommonTypes.Result<(), CommonTypes.Error> {
    UserLib.updateUsername(userProfiles, caller, newUsername);
  };

  // --- Authorization extensions ---

  /// Get caller's own profile (alias for auth skill compatibility)
  public query ({ caller }) func getCallerUserProfile() : async ?Types.UserProfileView {
    UserLib.getProfile(userProfiles, caller);
  };

  /// Save caller's profile (alias for auth skill compatibility)
  public shared ({ caller }) func saveCallerUserProfile(
    profile : Types.UserProfile
  ) : async () {
    userProfiles.add(caller, profile);
  };
}
