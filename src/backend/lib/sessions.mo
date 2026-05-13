import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import SessionTypes "../types/sessions";
import CommonTypes "../types/common";

module {
  type Session = SessionTypes.Session;
  type View = SessionTypes.SessionView;
  type CreateInput = SessionTypes.CreateSessionInput;
  type UpdateInput = SessionTypes.UpdateGameStateInput;
  type Error = CommonTypes.Error;

  public func createSession(
    sessions : Map.Map<Text, Session>,
    sessionState : { var nextSessionId : Nat },
    caller : Principal,
    input : CreateInput,
    now : CommonTypes.Timestamp,
  ) : CommonTypes.Result<View, Error> {
    sessionState.nextSessionId += 1;
    let id = "session-" # sessionState.nextSessionId.toText();
    let session : Session = {
      sessionId = id;
      hostPrincipal = caller;
      gameName = input.gameName;
      var participants = [caller];
      var status = #waiting;
      var gameState = "{}";
      createdAt = now;
      maxParticipants = input.maxParticipants;
    };
    sessions.add(id, session);
    #ok(toView(session));
  };

  public func joinSession(
    sessions : Map.Map<Text, Session>,
    caller : Principal,
    sessionId : Text,
  ) : CommonTypes.Result<View, Error> {
    switch (sessions.get(sessionId)) {
      case null { #err(#sessionNotFound) };
      case (?s) {
        if (s.participants.size() >= s.maxParticipants) {
          return #err(#sessionFull);
        };
        let alreadyIn = s.participants.find(func(p : Principal) : Bool {
          Principal.equal(p, caller);
        });
        if (alreadyIn != null) { return #ok(toView(s)) };
        s.participants := s.participants.concat([caller]);
        #ok(toView(s));
      };
    };
  };

  public func leaveSession(
    sessions : Map.Map<Text, Session>,
    caller : Principal,
    sessionId : Text,
  ) : CommonTypes.Result<(), Error> {
    switch (sessions.get(sessionId)) {
      case null { #err(#sessionNotFound) };
      case (?s) {
        s.participants := s.participants.filter(func(p : Principal) : Bool {
          not Principal.equal(p, caller);
        });
        #ok(());
      };
    };
  };

  public func updateGameState(
    sessions : Map.Map<Text, Session>,
    caller : Principal,
    input : UpdateInput,
  ) : CommonTypes.Result<(), Error> {
    switch (sessions.get(input.sessionId)) {
      case null { #err(#sessionNotFound) };
      case (?s) {
        if (not Principal.equal(s.hostPrincipal, caller)) {
          return #err(#unauthorized);
        };
        s.gameState := input.gameState;
        s.status := input.status;
        #ok(());
      };
    };
  };

  public func getSession(
    sessions : Map.Map<Text, Session>,
    sessionId : Text,
  ) : ?View {
    switch (sessions.get(sessionId)) {
      case (?s) { ?toView(s) };
      case null { null };
    };
  };

  public func listWaitingSessions(
    sessions : Map.Map<Text, Session>,
    gameName : Text,
  ) : [View] {
    sessions.values()
      .filterMap(func(s : Session) : ?View {
        if (s.gameName == gameName and s.status == #waiting) { ?toView(s) } else { null };
      })
      .toArray();
  };

  public func toView(s : Session) : View {
    {
      sessionId = s.sessionId;
      hostPrincipal = s.hostPrincipal;
      gameName = s.gameName;
      participants = s.participants;
      status = s.status;
      gameState = s.gameState;
      createdAt = s.createdAt;
      maxParticipants = s.maxParticipants;
    };
  };
}
