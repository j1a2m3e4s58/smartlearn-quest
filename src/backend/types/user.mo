import CommonTypes "common";

module {
  /// Full user profile stored per Principal
  public type UserProfile = {
    username : Text;
    role : CommonTypes.UserRole;
    gradeLevel : ?CommonTypes.GradeLevel;
    createdAt : CommonTypes.Timestamp;
  };

  /// Public-facing profile (returned over API)
  public type UserProfileView = {
    username : Text;
    role : CommonTypes.UserRole;
    gradeLevel : ?CommonTypes.GradeLevel;
    createdAt : CommonTypes.Timestamp;
  };

  /// Input type for profile registration
  public type RegisterInput = {
    username : Text;
    role : CommonTypes.UserRole;
    gradeLevel : ?CommonTypes.GradeLevel;
  };
}
