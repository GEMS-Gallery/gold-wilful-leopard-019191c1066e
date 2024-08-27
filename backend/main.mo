import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";

import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Result "mo:base/Result";

actor {
  // Stable variables
  stable var audioData : ?Blob = null;
  stable var eventLog : [(Time.Time, Text)] = [];

  // Mutable variables
  var currentPlaybackStatus : Text = "idle";

  // Constants
  let MAX_LOG_SIZE = 100;

  // Convert text to speech (simulated)
  public func convertTextToSpeech(text : Text) : async Result.Result<(), Text> {
    // Simulate TTS conversion
    let simulatedAudioData = Blob.fromArray(Array.tabulate<Nat8>(100, func(i) = Nat8.fromNat(i % 256)));
    audioData := ?simulatedAudioData;
    #ok(())
  };

  // Play audio (simulated)
  public func playAudio() : async Result.Result<(), Text> {
    switch (audioData) {
      case (null) {
        #err("No audio data available")
      };
      case (?data) {
        currentPlaybackStatus := "playing";
        // Simulate audio playback
        let start = Time.now();
        while (Time.now() - start < 2_000_000_000) {
          // Busy wait
        };
        currentPlaybackStatus := "idle";
        #ok(())
      };
    };
  };

  // Handle event
  public func handleEvent(eventType : Text) : async Result.Result<(), Text> {
    let timestamp = Time.now();
    if (eventLog.size() >= MAX_LOG_SIZE) {
      eventLog := Array.tabulate<(Time.Time, Text)>(MAX_LOG_SIZE - 1, func (i : Nat) = eventLog[i + 1]);
    };
    eventLog := Array.append(eventLog, [(timestamp, eventType)]);
    if (eventType == "participant_joined") {
      let ttsResult = await convertTextToSpeech("Hello there, new participant!");
      switch (ttsResult) {
        case (#ok(_)) { ignore await playAudio(); };
        case (#err(e)) { return #err(e); };
      };
    };
    #ok(())
  };

  // Get current playback status
  public query func getPlaybackStatus() : async Text {
    currentPlaybackStatus
  };

  // Get event log
  public query func getEventLog() : async [(Time.Time, Text)] {
    eventLog
  };
}
