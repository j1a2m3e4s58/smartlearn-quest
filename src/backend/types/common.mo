module {
  /// Timestamp in nanoseconds (from Time.now())
  public type Timestamp = Int;

  /// Grade levels aligned with Ghana Education Service Basic 1-9
  public type GradeLevel = {
    #basic1; #basic2; #basic3; #basic4; #basic5;
    #basic6; #basic7; #basic8; #basic9;
  };

  /// Platform user roles
  public type UserRole = {
    #student;
    #teacher;
    #parent;
    #admin;
  };

  /// Generic result type used across all domains
  public type Result<T, E> = { #ok : T; #err : E };

  /// Common error variants shared across domains
  public type Error = {
    #notFound;
    #alreadyExists;
    #unauthorized;
    #invalidInput : Text;
    #sessionFull;
    #sessionNotFound;
  };
}
