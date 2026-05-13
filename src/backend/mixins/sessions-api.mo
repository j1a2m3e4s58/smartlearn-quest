import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import AccessControl "mo:caffeineai-authorization/access-control";
import SessionTypes "../types/sessions";
import CommonTypes "../types/common";
import SessionsLib "../lib/sessions";

mixin (
  accessControlState : AccessControl.AccessControlState,
  sessions : Map.Map<Text, SessionTypes.Session>,
  sessionState : { var nextSessionId : Nat },
) {
  /// Create a new multiplayer session
  public shared ({ caller }) func createSession(
    input : SessionTypes.CreateSessionInput
  ) : async CommonTypes.Result<SessionTypes.SessionView, CommonTypes.Error> {
    SessionsLib.createSession(sessions, sessionState, caller, input, Time.now());
  };

  /// Join an existing session
  public shared ({ caller }) func joinSession(
    sessionId : Text
  ) : async CommonTypes.Result<SessionTypes.SessionView, CommonTypes.Error> {
    SessionsLib.joinSession(sessions, caller, sessionId);
  };

  /// Leave a session
  public shared ({ caller }) func leaveSession(
    sessionId : Text
  ) : async CommonTypes.Result<(), CommonTypes.Error> {
    SessionsLib.leaveSession(sessions, caller, sessionId);
  };

  /// Update game state (host only)
  public shared ({ caller }) func updateGameState(
    input : SessionTypes.UpdateGameStateInput
  ) : async CommonTypes.Result<(), CommonTypes.Error> {
    SessionsLib.updateGameState(sessions, caller, input);
  };

  /// Get a session by ID
  public query ({ caller }) func getSession(
    sessionId : Text
  ) : async ?SessionTypes.SessionView {
    SessionsLib.getSession(sessions, sessionId);
  };

  /// List waiting sessions for a game
  public query ({ caller }) func listWaitingSessions(
    gameName : Text
  ) : async [SessionTypes.SessionView] {
    SessionsLib.listWaitingSessions(sessions, gameName);
  };
}
