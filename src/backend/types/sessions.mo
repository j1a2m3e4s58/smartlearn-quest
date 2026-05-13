import CommonTypes "common";

module {
  /// Multiplayer session status
  public type SessionStatus = {
    #waiting;
    #active;
    #completed;
  };

  /// Full multiplayer session record
  public type Session = {
    sessionId : Text;
    hostPrincipal : Principal;
    gameName : Text;
    var participants : [Principal];
    var status : SessionStatus;
    var gameState : Text;          // JSON-encoded game state
    createdAt : CommonTypes.Timestamp;
    maxParticipants : Nat;
  };

  /// Immutable session view for API responses
  public type SessionView = {
    sessionId : Text;
    hostPrincipal : Principal;
    gameName : Text;
    participants : [Principal];
    status : SessionStatus;
    gameState : Text;
    createdAt : CommonTypes.Timestamp;
    maxParticipants : Nat;
  };

  /// Input to create a new session
  public type CreateSessionInput = {
    gameName : Text;
    maxParticipants : Nat;
  };

  /// Input to update game state
  public type UpdateGameStateInput = {
    sessionId : Text;
    gameState : Text;
    status : SessionStatus;
  };
}
