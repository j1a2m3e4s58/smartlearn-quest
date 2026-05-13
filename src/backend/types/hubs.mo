module {
  /// Hub identifiers for all 13 ICT hubs
  public type HubId = {
    #mouseMaster;
    #keyboardNinja;
    #fileFolder;
    #internetBrowser;
    #typingSpeed;
    #microsoftOffice;
    #codingBasics;
    #cyberSafety;
    #networking;
    #digitalCreativity;
    #operatingSystem;
    #cloudComputing;
    #computerEngineering;
  };

  /// Subject categories
  public type SubjectId = {
    #ict;
    #robotics;
    #science;
    #mathematics;
    #english;
    #criticalThinking;
  };

  /// Per-hub progress record
  public type HubProgress = {
    hubId : Text;                  // serialized HubId
    missionsCompleted : Nat;
    totalMissions : Nat;
    unlocked : Bool;
    completionPercent : Nat;       // 0–100
    lastUpdated : Int;             // Timestamp
  };

  /// Subject-level aggregated summary
  public type SubjectSummary = {
    subjectId : Text;              // serialized SubjectId
    totalHubs : Nat;
    completedHubs : Nat;
    overallPercent : Nat;          // 0–100
  };

  /// Input to update hub progress
  public type HubProgressUpdate = {
    hubId : Text;
    missionsCompleted : Nat;
    totalMissions : Nat;
    unlocked : Bool;
  };
}
