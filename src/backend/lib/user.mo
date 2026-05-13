import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import UserTypes "../types/user";
import CommonTypes "../types/common";

module {
  type Profile = UserTypes.UserProfile;
  type View = UserTypes.UserProfileView;
  type Input = UserTypes.RegisterInput;
  type Error = CommonTypes.Error;

  public func register(
    profiles : Map.Map<Principal, Profile>,
    caller : Principal,
    input : Input,
    now : CommonTypes.Timestamp,
  ) : CommonTypes.Result<View, Error> {
    if (profiles.containsKey(caller)) {
      return #err(#alreadyExists);
    };
    let profile : Profile = {
      username = input.username;
      role = input.role;
      gradeLevel = input.gradeLevel;
      createdAt = now;
    };
    profiles.add(caller, profile);
    #ok(toView(profile));
  };

  public func getProfile(
    profiles : Map.Map<Principal, Profile>,
    principal : Principal,
  ) : ?View {
    switch (profiles.get(principal)) {
      case (?p) { ?toView(p) };
      case null { null };
    };
  };

  public func updateUsername(
    profiles : Map.Map<Principal, Profile>,
    caller : Principal,
    newUsername : Text,
  ) : CommonTypes.Result<(), Error> {
    switch (profiles.get(caller)) {
      case null { #err(#notFound) };
      case (?profile) {
        profiles.add(caller, { profile with username = newUsername });
        #ok(());
      };
    };
  };

  public func toView(profile : Profile) : View {
    {
      username = profile.username;
      role = profile.role;
      gradeLevel = profile.gradeLevel;
      createdAt = profile.createdAt;
    };
  };
}
