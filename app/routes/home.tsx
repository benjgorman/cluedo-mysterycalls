import React, { useState } from "react";
import CaseInfoTabs from "../components/CaseInfoTabs";
import ChiefInspesctorSection from "../components/ChiefInspectorSection";
import SuspectsCallPanel from "../components/SuspectsCallPanel";
import PhoneNumberPanel from "../components/PhoneNumberPanel";
import PrivacyFooter from "../components/PrivacyFooter";
import CluedoLogo from "~/components/CluedoLogo";
import * as CallService from "../services/CallService";
import type { CallLogEntry } from "../services/CallService";
import { getPathwayId, getVoiceId, getCharacterInstruction } from "../config/blandAIConfig";

// Update the suspects array
const suspects = [
  { 
    name: "Miss Scarlet", 
    color: "scarlet", 
    image: "images/scarlet.png", 
    id: getPathwayId("scarlet") || "",
    voice_id: getVoiceId("scarlet"),
    characterInstruction: getCharacterInstruction("scarlet")
  },
  { 
    name: "Colonel Mustard", 
    color: "mustard", 
    image: "images/mustard.png", 
    id: getPathwayId("mustard") || "",
    voice_id: getVoiceId("mustard"),
    characterInstruction: getCharacterInstruction("mustard")
  },
  { 
    name: "Mrs. White", 
    color: "white", 
    image: "images/white.png", 
    id: getPathwayId("white") || "",
    voice_id: getVoiceId("white"),
    characterInstruction: getCharacterInstruction("white")
  },
  { 
    name: "Mr. Green", 
    color: "green", 
    image: "images/green.png", 
    id: getPathwayId("green") || "",
    voice_id: getVoiceId("green"),
    characterInstruction: getCharacterInstruction("green")
  },
  { 
    name: "Mrs. Peacock", 
    color: "peacock", 
    image: "images/peacock.png", 
    id: getPathwayId("peacock") || "",
    voice_id: getVoiceId("peacock"),
    characterInstruction: getCharacterInstruction("peacock")
  },
  { 
    name: "Professor Plum", 
    color: "plum", 
    image: "images/plum.png", 
    id: getPathwayId("plum") || "",
    voice_id: getVoiceId("plum"),
    characterInstruction: getCharacterInstruction("plum")
  },
];

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [callId, setCallId] = useState("");
  const [callStatus, setCallStatus] = useState("");
  const [activeSuspect, setActiveSuspect] = useState(null);
  const [callHistory, setCallHistory] = useState<CallLogEntry[]>([]);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [showNumber, setShowNumber] = useState(false);
  const [activeTab, setActiveTab] = useState("case"); // New state for case file tabs
  const [pendingSummaries, setPendingSummaries] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [chiefMessage, setChiefMessage] = useState("");
  const [accusation, setAccusation] = useState("");
  const [accusationSubmitted, setAccusationSubmitted] = useState(false);
  const [chiefCallActive, setChiefCallActive] = useState(false);
  const [chiefCallId, setChiefCallId] = useState("");
  const [chiefCallStatus, setChiefCallStatus] = useState("");
  const [selectedWeapon, setSelectedWeapon] = useState("");

  const handleCall = (suspect: { name: any; color?: string; image?: string; id: any; voice_id?: string; }) => {
    if (!phoneNumber.trim()) {
      setResponseMessage("Please enter a phone number.");
      return;
    }

    setActiveSuspect(suspect.name);
    const startTime = new Date();
    setCallStartTime(startTime);
    
    CallService.initiateSuspectCall(phoneNumber, suspect)
      .then((data) => {
        if (data.call_id) {
          setResponseMessage(`${suspect.name} is calling...`);
          setCallId(`Active Call ID: ${data.call_id}`);
          pollCallStatus(data.call_id, suspect.name, suspect.color || "", startTime);
        } else {
          setResponseMessage(data.error || "Error: No call ID returned");
          setActiveSuspect(null);
          setCallStartTime(null);
        }
      })
      .catch((error) => {
        setResponseMessage(`Error: ${error}`);
        setActiveSuspect(null);
        setCallStartTime(null);
      });
  };

  const pollCallStatus = (callId: string, suspectName: string, suspectColor: string, startTime: Date) => {
    setTimeout(() => {
      const interval = setInterval(() => {
        CallService.checkCallStatus(callId)
          .then((data) => {
            if (data.status === "completed") {
              clearInterval(interval);
              const endTime = new Date();
              
              // Try to get initial summary if available
              const summary = CallService.extractSummaryFromCall(data);
              
              // Add to call history with or without summary
              const newLogEntry = CallService.createCallLogEntry(
                suspectName,
                callId,
                startTime,
                endTime,
                "Completed",
                suspectColor,
                summary
              );
              
              setCallHistory(prev => [newLogEntry, ...prev].slice(0, 5)); // Keep most recent 5 calls
              setCallStatus(`${suspectName}'s call has ended.`);
              setResponseMessage("");
              setActiveSuspect(null);
              setCallStartTime(null);
              
              if (!summary) {
                // Add this call to pending summaries for later polling
                setPendingSummaries(prev => [...prev, callId]);
              }
            } else {
              setCallStatus(`${suspectName}'s call ${data.status}.`);
            }
          })
          .catch((err) => {
            clearInterval(interval);
            setCallStatus(`Error checking call: ${err}`);
            setActiveSuspect(null);
            setCallStartTime(null);
          });
      }, 3000);
    }, 5000);
  };

  // Add useEffect to handle periodic polling for summaries
  React.useEffect(() => {
    document.title = "Cluedo Mystery Calls | Interactive Detective Game";
    // Only set up polling if we have calls waiting for summaries
    if (pendingSummaries.length === 0) return;
    
    const pollInterval = setInterval(() => {
      // Clone the pending array to track which ones to keep
      const stillPending: string[] = [...pendingSummaries];
      
      // Check each pending call
      pendingSummaries.forEach(callId => {
        CallService.checkCallStatus(callId)
          .then(data => {
            // Check if summary is available now
            const summary = CallService.extractSummaryFromCall(data);
            if (summary) {
              // Update the call log entry with the new summary
              setCallHistory(prev => prev.map(entry => {
                // Find the matching call and update its summary
                if (entry.callId === callId) {
                  return { ...entry, summary };
                }
                return entry;
              }));
              
              // Remove this call from pending list
              const index = stillPending.indexOf(callId);
              if (index !== -1) stillPending.splice(index, 1);
            }
          })
          .catch(err => {
            console.error("Error checking for summary update:", err);
            // Remove from pending on error to avoid endless retries
            const index = stillPending.indexOf(callId);
            if (index !== -1) stillPending.splice(index, 1);
          });
      });
      
      // Update the pending list
      setPendingSummaries(stillPending);
      
      // If no more pending summaries, clear interval
      if (stillPending.length === 0) {
        clearInterval(pollInterval);
      }
    }, 10000); // Check every 10 seconds
    
    // Clean up on unmount
    return () => clearInterval(pollInterval);
  }, [pendingSummaries]);

  // Add this useEffect for the real-time clock
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Add this function to handle submitting the accusation
  const handleAccusation = () => {
    if (!accusation.trim()) {
      setChiefMessage("You need to specify who you think committed the crime.");
      return;
    }
    
    if (!selectedWeapon.trim()) {
      setChiefMessage("You must specify the murder weapon used.");
      return;
    }
    
    if (!phoneNumber.trim()) {
      setChiefMessage("Please enter your phone number to receive the Chief's call.");
      return;
    }
    
    // Set accusation as submitted
    setChiefMessage(`Arrest warrant issued for ${accusation} using the ${selectedWeapon}. The Chief Inspector will call you shortly to discuss your findings...`);
    setAccusationSubmitted(true);
    
    // Automatically initiate the call from the Chief
    initiateChiefCall();
  };

  // Create a separate function to initiate the call (extracted from handleChiefCall)
  const initiateChiefCall = () => {
    setChiefCallActive(true);
    const startTime = new Date();
    
    CallService.initiateChiefCall(phoneNumber, accusation, selectedWeapon)
      .then((data) => {
        if (data.call_id) {
          setChiefCallId(`Call ID: ${data.call_id}`);
          setChiefCallStatus("Connecting with Chief Inspector Gray...");
          pollChiefCallStatus(data.call_id, startTime);
        } else {
          setChiefMessage("Error: Unable to connect with Chief Inspector.");
          setChiefCallActive(false);
        }
      })
      .catch((error) => {
        setChiefMessage(`Error: ${error}`);
        setChiefCallActive(false);
      });
  };

  // Add this function to track Chief Inspector call status
  const pollChiefCallStatus = (callId: string, startTime: Date) => {
    setTimeout(() => {
      const interval = setInterval(() => {
        CallService.checkCallStatus(callId)
          .then((data) => {
            if (data.status === "completed") {
              clearInterval(interval);
              setChiefCallStatus("Call with Chief Inspector has ended.");
              setChiefCallActive(false);
              
              // Add the Chief's call to the call history
              const endTime = new Date();
              const summary = CallService.extractSummaryFromCall(data);
              
              // Add Chief call to history
              const chiefCallEntry = CallService.createCallLogEntry(
                "Chief Inspector Gray",
                callId,
                startTime,
                endTime,
                "Completed",
                "text-[#3fad6c]", // Green for the Chief
                summary
              );
              
              setCallHistory(prev => [chiefCallEntry, ...prev].slice(0, 5));
              setChiefMessage("Thank you for explaining your reasoning. The investigation will proceed based on your findings.");
              
              if (!summary) {
                setPendingSummaries(prev => [...prev, callId]);
              }
            } else {
              setChiefCallStatus(`Call with Chief Inspector: ${data.status}`);
            }
          })
          .catch((err) => {
            clearInterval(interval);
            setChiefCallStatus(`Error: ${err}`);
            setChiefCallActive(false);
          });
      }, 3000);
    }, 5000);
  };

  // Calculate deadline (for example, 10 PM on the current day)
  const deadline = new Date(currentTime);
  deadline.setHours(22, 0, 0, 0); // Set to 10:00 PM
  
  // Calculate time remaining
  const timeRemaining = deadline.getTime() - currentTime.getTime();
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  
  // Format the current time
  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-[#0d1117] text-[#58a6ff] font-orbitron flex flex-col justify-center items-center h-screen m-0 text-center">
      <div className="flex flex-col w-full max-w-[1100px] px-4 gap-5">
        {/* Top row - contains two panes */}
        <div className="flex gap-5 w-full">
          {/* Phone Panel - Left side */}
          <div className="container bg-[rgba(20,20,20,0.9)] p-8 rounded-lg shadow-[0px_0px_15px_rgba(88,166,255,0.5)] text-center w-[500px]">
            <CluedoLogo/>
            <p className="text-sm mb-5">Click on a suspect to receive a call with their alibi.</p>
            <p className="text-sm mb-5">Use the information to deduce who the killer is!</p>
            
            <PhoneNumberPanel
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              showNumber={showNumber}
              setShowNumber={setShowNumber}
            />

            <SuspectsCallPanel
              suspects={suspects}
              activeSuspect={activeSuspect}
              handleCall={handleCall}
            />

            <p className="mt-4 text-sm text-[#ff6b6b]">{responseMessage}</p>
            <p className="mt-4 text-sm text-[#58a6ff]">{callId}</p>
            <p className="mt-4 text-sm text-[#58a6ff]">{callStatus}</p>
          </div>
          <CaseInfoTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            callHistory={callHistory}
            pendingSummaries={pendingSummaries}
          />
        </div>
        
        <ChiefInspesctorSection
          formattedTime={formattedTime}
          deadline={deadline}
          hoursRemaining={hoursRemaining}
          minutesRemaining={minutesRemaining}
          chiefMessage={chiefMessage}
          accusationSubmitted={accusationSubmitted}
          accusation={accusation}
          selectedWeapon={selectedWeapon}
          suspects={suspects}
          chiefCallActive={chiefCallActive}
          chiefCallStatus={chiefCallStatus}
          chiefCallId={chiefCallId}
          handleAccusation={handleAccusation}
          setAccusation={setAccusation}
          setSelectedWeapon={setSelectedWeapon}
        />

        <PrivacyFooter/>
      </div>
    </div>
  );
}
