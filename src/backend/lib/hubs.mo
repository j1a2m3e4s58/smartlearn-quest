import Map "mo:core/Map";
import Principal "mo:core/Principal";
import HubTypes "../types/hubs";
import CommonTypes "../types/common";

module {
  type HubProgress = HubTypes.HubProgress;
  type SubjectSummary = HubTypes.SubjectSummary;
  type Update = HubTypes.HubProgressUpdate;
  type Error = CommonTypes.Error;

  // Subject → hub ID list mapping
  let subjectHubs : [(Text, [Text])] = [
    ("ict", ["mouseMaster", "keyboardNinja", "fileFolder", "internetBrowser", "typingSpeed", "microsoftOffice", "codingBasics", "cyberSafety", "networking", "digitalCreativity", "operatingSystem", "cloudComputing", "computerEngineering"]),
    ("robotics", ["robotBuilding", "sensors", "circuits", "codingRobots", "aiAutomation", "electronicsLab", "machineLogic", "droneSystems", "smartHome", "mechanicalEngineering", "industrialAutomation", "mechatronics"]),
    ("science", ["humanBody", "plantsAnimals", "spaceScience", "chemistryLab", "electricity", "matterMaterials", "weatherClimate", "physicsMotion", "environmentalScience", "earthScience", "renewableEnergy", "scientificInvestigation"]),
    ("mathematics", ["arithmeticArena", "fractionsKingdom", "geometryBuilder", "algebraAdventure", "statisticsChallenge", "moneyMath", "measurementLab", "timeSpeed", "graphingSystems", "mathematicalReasoning", "mentalMathArena", "magicMathematics"]),
    ("english", ["grammarCity", "vocabularyQuest", "readingAdventure", "pronunciationStudio", "storyBuilder", "poetryLiterature", "spellingKingdom", "listeningChallenge", "publicSpeaking", "debateArena", "communicationSkills", "creativeWriting"]),
    ("criticalThinking", ["logicPuzzle", "memoryTraining", "strategyGames", "brainTeasers", "codingLogic", "escapeRoom", "patternRecognition", "detectiveInvestigation", "strategicPlanning", "innovationLab", "decisionMaking", "problemSolving"]),
  ];

  public func getHubProgress(
    hubProgress : Map.Map<Text, HubProgress>,
    principal : Principal,
    hubId : Text,
  ) : ?HubProgress {
    hubProgress.get(hubKey(principal, hubId));
  };

  public func getAllHubProgress(
    hubProgress : Map.Map<Text, HubProgress>,
    principal : Principal,
  ) : [HubProgress] {
    let prefix = principal.toText() # ":";
    hubProgress.entries()
      .filterMap(func((k, v) : (Text, HubProgress)) : ?HubProgress {
        if (k.startsWith(#text prefix)) { ?v } else { null };
      })
      .toArray();
  };

  public func updateHubProgress(
    hubProgress : Map.Map<Text, HubProgress>,
    principal : Principal,
    update : Update,
    now : CommonTypes.Timestamp,
  ) : CommonTypes.Result<HubProgress, Error> {
    let pct = if (update.totalMissions == 0) { 0 } else {
      update.missionsCompleted * 100 / update.totalMissions;
    };
    let record : HubProgress = {
      hubId = update.hubId;
      missionsCompleted = update.missionsCompleted;
      totalMissions = update.totalMissions;
      unlocked = update.unlocked;
      completionPercent = pct;
      lastUpdated = now;
    };
    hubProgress.add(hubKey(principal, update.hubId), record);
    #ok(record);
  };

  public func getSubjectSummary(
    hubProgress : Map.Map<Text, HubProgress>,
    principal : Principal,
    subjectId : Text,
  ) : SubjectSummary {
    let hubIds = getHubIdsForSubject(subjectId);
    var completed = 0;
    let total = hubIds.size();
    for (hId in hubIds.values()) {
      switch (hubProgress.get(hubKey(principal, hId))) {
        case (?hp) { if (hp.completionPercent >= 100) { completed += 1 } };
        case null {};
      };
    };
    let overallPct = if (total == 0) { 0 } else { completed * 100 / total };
    { subjectId = subjectId; totalHubs = total; completedHubs = completed; overallPercent = overallPct };
  };

  public func hubKey(principal : Principal, hubId : Text) : Text {
    principal.toText() # ":" # hubId;
  };

  func getHubIdsForSubject(subjectId : Text) : [Text] {
    for ((sid, hubs) in subjectHubs.values()) {
      if (sid == subjectId) { return hubs };
    };
    [];
  };
}
