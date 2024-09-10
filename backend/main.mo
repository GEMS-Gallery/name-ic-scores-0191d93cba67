import Hash "mo:base/Hash";

import Array "mo:base/Array";
import Time "mo:base/Time";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Error "mo:base/Error";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";

actor {
  // Types
  type Sport = Text;
  type GameScore = {
    homeTeam: Text;
    awayTeam: Text;
    homeScore: Nat;
    awayScore: Nat;
  };

  // Stable variables
  stable var scores: [(Sport, [GameScore])] = [];
  stable var lastUpdate = Time.now();

  // Initialize HashMap
  let scoresMap = HashMap.fromIter<Sport, [GameScore]>(scores.vals(), 10, Text.equal, Text.hash);

  // Helper function to generate mock scores for all sports
  func generateMockScores(sport: Sport): [GameScore] {
    switch (sport) {
      case ("MLB") [
        { homeTeam = "Yankees"; awayTeam = "Red Sox"; homeScore = 3; awayScore = 2 },
        { homeTeam = "Dodgers"; awayTeam = "Giants"; homeScore = 5; awayScore = 4 },
        { homeTeam = "Cubs"; awayTeam = "Cardinals"; homeScore = 2; awayScore = 2 },
        { homeTeam = "Mets"; awayTeam = "Phillies"; homeScore = 1; awayScore = 0 }
      ];
      case ("NBA") [
        { homeTeam = "Lakers"; awayTeam = "Celtics"; homeScore = 105; awayScore = 98 },
        { homeTeam = "Warriors"; awayTeam = "Nets"; homeScore = 110; awayScore = 105 }
      ];
      case ("NFL") [
        { homeTeam = "Patriots"; awayTeam = "Bills"; homeScore = 24; awayScore = 17 },
        { homeTeam = "49ers"; awayTeam = "Seahawks"; homeScore = 28; awayScore = 21 }
      ];
      case ("NHL") [
        { homeTeam = "Bruins"; awayTeam = "Canadiens"; homeScore = 3; awayScore = 2 },
        { homeTeam = "Blackhawks"; awayTeam = "Red Wings"; homeScore = 4; awayScore = 3 }
      ];
      case ("MLS") [
        { homeTeam = "Galaxy"; awayTeam = "LAFC"; homeScore = 2; awayScore = 1 },
        { homeTeam = "Sounders"; awayTeam = "Timbers"; homeScore = 3; awayScore = 2 }
      ];
      case (_) [];
    }
  };

  // Update scores
  func updateScores(): async () {
    let sports = ["MLB", "NBA", "NFL", "NHL", "MLS"];
    for (sport in sports.vals()) {
      let newScores = generateMockScores(sport);
      scoresMap.put(sport, newScores);
    };
    lastUpdate := Time.now();
  };

  // Public query function to get scores for a specific sport
  public query func getScores(sport: Sport): async Result.Result<[GameScore], Text> {
    switch (scoresMap.get(sport)) {
      case (?scores) #ok(scores);
      case null #err("Sport not found");
    }
  };

  // Public update function to refresh scores
  public func refreshScores(): async () {
    await updateScores();
  };

  // Get last update time
  public query func getLastUpdateTime(): async Int {
    lastUpdate
  };

  // System functions
  system func preupgrade() {
    scores := Array.map<(Sport, [GameScore]), (Sport, [GameScore])>(
      Iter.toArray(scoresMap.entries()),
      func ((k, v)) { (k, v) }
    );
  };

  system func postupgrade() {
    for ((sport, gameScores) in scores.vals()) {
      scoresMap.put(sport, gameScores);
    };
  };
}
