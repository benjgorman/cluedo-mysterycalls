import React, { useState } from "react";

// Update the suspects array to include voice_id
const suspects = [
  { 
    name: "Miss Scarlet", 
    color: "scarlet", 
    image: "images/scarlet.png", 
    id: "83b317c5-76da-4ff0-a09b-fc0bf7f49a88",
    voice_id: "17e8f694-d230-4b64-b040-6108088d9e6c" 
  },
  { 
    name: "Colonel Mustard", 
    color: "mustard", 
    image: "images/mustard.png", 
    id: "a3831d2e-b505-4d11-a62d-8521a370e217",
    voice_id: "bac6643e-4b78-44c0-a006-2b9ff21dba44" 
  },
  { 
    name: "Mrs. White", 
    color: "white", 
    image: "images/white.png", 
    id: "63cd4260-ff8c-4a45-81d9-49e201e26883",
    voice_id: "17a0eab8-d7d5-4304-bb41-7a7b6bda96d3" 
  },
  { 
    name: "Mr. Green", 
    color: "green", 
    image: "images/green.png", 
    id: "1bdd8faf-4a71-4868-a903-722f2b9d444b",
    voice_id: "923ef241-cffc-4b6d-a59a-9c3ec3614d53" 
  },
  { 
    name: "Mrs. Peacock", 
    color: "peacock", 
    image: "images/peacock.png", 
    id: "775bea2a-e3fd-481e-9607-34283162716d",
    voice_id: "fc585787-f5a8-4c3d-a16f-759a895c114a" 
  },
  { 
    name: "Professor Plum", 
    color: "plum", 
    image: "images/plum.png", 
    id: "17a7cbad-2445-4bd3-8342-daf3748ed670",
    voice_id: "a4525de6-7c12-4df8-a1cb-90651de9323d" 
  },
];

interface CallLogEntry {
  suspect: string;
  callId: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: string;
  color: string;
  summary?: string; // Optional summary field
}

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
    
    const options = {
      method: "POST",
      headers: {
        Authorization: "org_099e3ac75165ce57638bc891da27d7f7d039a2f0dbcee1c0b8e43b705d1e3b1ba3a4d77477a59a57210369",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number: phoneNumber,
        task: `Call from ${suspect.name}`,
        pathway_id: suspect.id,
        voice: suspect.voice_id // Add the voice_id parameter here
      }),
    };

    fetch("https://us.api.bland.ai/v1/calls", options)
      .then((res) => res.json())
      .then((data) => {
        if (data.call_id) {
          setResponseMessage(`${suspect.name} is calling...`);
          setCallId(`Active Call ID: ${data.call_id}`);
          pollCallStatus(data.call_id, suspect.name, suspect.color || "", startTime);
        } else {
          setResponseMessage("Error: No call ID returned");
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
        fetch(`https://api.bland.ai/v1/calls/${callId}`, {
          method: "GET",
          headers: {
            Authorization: "org_099e3ac75165ce57638bc891da27d7f7d039a2f0dbcee1c0b8e43b705d1e3b1ba3a4d77477a59a57210369",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "completed") {
              clearInterval(interval);
              const endTime = new Date();
              const durationMs = endTime.getTime() - startTime.getTime();
              const durationSec = Math.floor(durationMs / 1000);
              const minutes = Math.floor(durationSec / 60);
              const seconds = durationSec % 60;
              const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
              
              // Try to get initial summary if available
              let summary = "";
              if (data.summary) {
                summary = data.summary;
              } else if (data.transcript && data.transcript.length > 0) {
                summary = data.transcript.slice(0, 150) + "...";
              } else {
                // Add this call to pending summaries for later polling
                setPendingSummaries(prev => [...prev, callId]);
              }
              
              // Add to call history with or without summary
              const newLogEntry: CallLogEntry = {
                suspect: suspectName,
                callId: callId,
                startTime: startTime.toLocaleTimeString(),
                endTime: endTime.toLocaleTimeString(),
                duration: durationStr,
                status: "Completed",
                color: suspectColor,
                summary: summary || "Generating summary..."
              };
              
              setCallHistory(prev => [newLogEntry, ...prev].slice(0, 5)); // Keep most recent 5 calls
              setCallStatus(`${suspectName}'s call has ended.`);
              setResponseMessage("");
              setActiveSuspect(null);
              setCallStartTime(null);
            } else {
              setCallStatus(`${suspectName}'s call ${data.status}.`);
            }
          })
          .catch((err) => {
            // Error handling code remains the same
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
        fetch(`https://api.bland.ai/v1/calls/${callId}`, {
          method: "GET",
          headers: {
            Authorization: "org_099e3ac75165ce57638bc891da27d7f7d039a2f0dbcee1c0b8e43b705d1e3b1ba3a4d77477a59a57210369",
          },
        })
          .then(res => res.json())
          .then(data => {
            // Check if summary is available now
            if (data.summary || (data.transcript && data.transcript.length > 0)) {
              // Get the summary text
              const summaryText = data.summary || data.transcript.slice(0, 150) + "...";
              
              // Update the call log entry with the new summary
              setCallHistory(prev => prev.map(entry => {
                // Find the matching call and update its summary
                if (entry.callId === callId) {
                  return { ...entry, summary: summaryText };
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
    
    const options = {
      method: "POST",
      headers: {
        Authorization: "org_099e3ac75165ce57638bc891da27d7f7d039a2f0dbcee1c0b8e43b705d1e3b1ba3a4d77477a59a57210369",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number: phoneNumber,
        task: `Call from Chief Inspector Gray regarding the accusation against ${accusation} with the ${selectedWeapon}`,
        initial_message: `Hello detective. This is Chief Inspector Gray. I've received your arrest warrant for ${accusation} using the ${selectedWeapon} as the murder weapon. I need you to walk me through your evidence and reasoning. Why do you believe ${accusation} is guilty? What evidence links them to the crime scene? And how did they use the ${selectedWeapon}?`
      }),
    };

    fetch("https://us.api.bland.ai/v1/calls", options)
      .then((res) => res.json())
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
        fetch(`https://api.bland.ai/v1/calls/${callId}`, {
          method: "GET",
          headers: {
            Authorization: "org_099e3ac75165ce57638bc891da27d7f7d039a2f0dbcee1c0b8e43b705d1e3b1ba3a4d77477a59a57210369",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "completed") {
              clearInterval(interval);
              setChiefCallStatus("Call with Chief Inspector has ended.");
              setChiefCallActive(false);
              
              // Add the Chief's call to the call history
              const endTime = new Date();
              const durationMs = endTime.getTime() - startTime.getTime();
              const durationSec = Math.floor(durationMs / 1000);
              const minutes = Math.floor(durationSec / 60);
              const seconds = durationSec % 60;
              const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
              
              // Try to get summary
              let summary = "";
              if (data.summary) {
                summary = data.summary;
              } else if (data.transcript && data.transcript.length > 0) {
                summary = data.transcript.slice(0, 150) + "...";
              } else {
                // Add to pending summaries for later polling
                setPendingSummaries(prev => [...prev, callId]);
              }
              
              // Add Chief call to history
              const chiefCallEntry = {
                suspect: "Chief Inspector Gray",
                callId: callId,
                startTime: startTime.toLocaleTimeString(),
                endTime: endTime.toLocaleTimeString(),
                duration: durationStr,
                status: "Completed",
                color: "text-[#3fad6c]", // Green for the Chief
                summary: summary || "Generating debrief summary..."
              };
              
              setCallHistory(prev => [chiefCallEntry, ...prev].slice(0, 5));
              setChiefMessage("Thank you for explaining your reasoning. The investigation will proceed based on your findings.");
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
        {/* Top row - contains the existing two panes */}
        <div className="flex gap-5 w-full">
          {/* Phone Panel - Left side */}
          <div className="container bg-[rgba(20,20,20,0.9)] p-8 rounded-lg shadow-[0px_0px_15px_rgba(88,166,255,0.5)] text-center w-[500px]">
            <h1 className="cluedo-logo">
              CL<span className="letter-u">U</span>EDO
              <span className="logo-subtitle ml-3">Mystery Calls</span>
            </h1>
            <p className="text-sm mb-5">Click on a suspect to receive a call with their alibi.</p>
            <p className="text-sm mb-5">Use the information to deduce who the killer is!</p>
            
            {/* Phone number input with toggle */}
            <div className="phone-input-container">
            <label hidden>Phone Number</label>
              <input
                type={showNumber ? "text" : "password"}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                className="p-2 w-4/5 mb-5 rounded border-none text-center text-lg"
              />
              <button
                type="button"
                onClick={() => setShowNumber(!showNumber)}
                className="phone-toggle-btn"
                aria-label={showNumber ? "Hide number" : "Show number"}
              >
                {showNumber ? "🔒" : "👁️"}
              </button>
            </div>

            <div className={`suspects grid grid-cols-3 gap-4 ${activeSuspect ? 'has-active-call' : ''}`}>
              {suspects.map((suspect) => (
                <div 
                  key={suspect.name} 
                  className={`suspect-container flex flex-col items-center gap-1 min-h-[120px] ${activeSuspect === suspect.name ? 'active' : ''}`}
                >
                  <img src={suspect.image} alt={suspect.name} className="w-[60px] h-[60px] rounded-full border-2 border-white" />
                  <button 
                    className={`suspect w-full p-2 rounded border-none cursor-pointer text-lg uppercase transition-all duration-300 ease-in-out min-h-[50px] ${suspect.color}`} 
                    onClick={() => handleCall(suspect)}
                    disabled={activeSuspect !== null}
                  >
                    {suspect.name}
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-[#ff6b6b]">{responseMessage}</p>
            <p className="mt-4 text-sm text-[#58a6ff]">{callId}</p>
            <p className="mt-4 text-sm text-[#58a6ff]">{callStatus}</p>
            
            {/* Call Log section removed - now in the case file */}
          </div>
          
          {/* Case File Panel - Right side */}
          <div className="case-file bg-[rgba(20,20,20,0.8)] rounded-lg shadow-[0px_0px_15px_rgba(88,166,255,0.3)] w-[500px] flex flex-col">
            {/* Case file tabs */}
            <div className="tabs flex">
              <button 
                className={`tab-btn flex-1 py-3 px-4 text-sm uppercase tracking-wider ${activeTab === 'case' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('case')}
              >
                Case
              </button>
              <button 
                className={`tab-btn flex-1 py-3 px-4 text-sm uppercase tracking-wider ${activeTab === 'mansion' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('mansion')}
              >
                Mansion
              </button>
              <button 
                className={`tab-btn flex-1 py-3 px-4 text-sm uppercase tracking-wider ${activeTab === 'weapons' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('weapons')}
              >
                Weapons
              </button>
              <button 
                className={`tab-btn flex-1 py-3 px-4 text-sm uppercase tracking-wider ${activeTab === 'notes' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('notes')}
              >
                Notes
              </button>
            </div>
            
            {/* Case file content */}
            <div className="case-content p-6 text-left overflow-y-auto flex-1" style={{ background: 'rgba(30,30,35,0.7)' }}>
              {activeTab === 'case' && (
                <div>
                  <h2 className="text-[#ff4242] font-bold text-xl mb-4 uppercase tracking-wider">The Murder of Mr. Black</h2>
                  <div className="case-photo mb-4 flex justify-center">
                    <img 
                      src="images/crimescene.png" 
                      alt="Crime Scene" 
                      className="max-w-[300px] border-2 border-[#333] rounded"
                    />
                  </div>
                  <h3 className="text-[#f5e8d5] font-bold mb-2">Case Report</h3>
                  <p className="text-[#eacda3] mb-3">
                    On the evening of March 6th, the body of Mr. Black was discovered in the Dining Hall of Black Manor during his annual dinner party.
                  </p>
                  <p className="text-[#eacda3] mb-3">
                    The victim was found at approximately 9:30 PM by the butler. The cause of death appears to be blunt force trauma. There is melted wax near the body and candles on the floor. Could it be an accident?
                  </p>
                  <h3 className="text-[#f5e8d5] font-bold mb-2 mt-4">Suspects</h3>
                  <p className="text-[#eacda3] mb-3">
                    All six dinner guests were present at the time of the murder and had opportunity to commit the crime.
                  </p>
                  <ul className="list-disc pl-5 text-[#eacda3] mb-4">
                    <li className="mb-1">Miss Scarlet - Business rival</li>
                    <li className="mb-1">Colonel Mustard - Old military friend</li>
                    <li className="mb-1">Mrs. White - The housekeeper</li>
                    <li className="mb-1">Mr. Green - The accountant</li>
                    <li className="mb-1">Mrs. Peacock - Socialite neighbor</li>
                    <li className="mb-1">Professor Plum - Academic colleague</li>
                  </ul>
                  
                  {/* Coroner's Report moved from weapons tab to here */}
                  <h3 className="text-[#f5e8d5] font-bold mb-2 mt-4">Coroner's Findings</h3>
                  <div className="p-4 bg-[rgba(255,66,66,0.1)] border border-[rgba(255,66,66,0.2)] rounded">
                    <h3 className="text-[#ff4242] font-bold mb-1">Coroner's Report</h3>
                    <p className="text-[#eacda3] text-sm italic">
                      "The victim suffered a severe blow to the head causing immediate death. 
                      From the nature of the wound, I believe the murder weapon was heavy and blunt, 
                      wielded with considerable force."
                    </p>
                  </div>
                </div>
              )}
              
              {activeTab === 'mansion' && (
                <div>
                  <h2 className="text-[#2a93d5] font-bold text-xl mb-4 uppercase tracking-wider">Black Manor</h2>
                  <div className="mansion-photo mb-4 flex justify-center">
                    <img 
                      src="images/mansion-map.jpg" 
                      alt="Mansion Map" 
                      className="max-w-[300px] border-2 border-[#333] rounded"
                    />
                  </div>
                  <h3 className="text-[#f5e8d5] font-bold mb-2">Rooms</h3>
                  <p className="text-[#eacda3] mb-4">
                    The mansion contains 6 key rooms where the murder could have taken place:
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-[#eacda3]">
                    <div className="room-item p-2 bg-[rgba(40,40,45,0.5)] rounded">
                      <h4 className="font-bold">Study</h4>
                      <p className="text-sm">Where the body was found. Contains a desk, bookshelves, and a fireplace.</p>
                    </div>
                    <div className="room-item p-2 bg-[rgba(40,40,45,0.5)] rounded">
                      <h4 className="font-bold">Library</h4>
                      <p className="text-sm">Filled with rare books and a large reading table.</p>
                    </div>
                    <div className="room-item p-2 bg-[rgba(40,40,45,0.5)] rounded">
                      <h4 className="font-bold">Billiard Room</h4>
                      <p className="text-sm">Contains a billiard table and trophy cabinet.</p>
                    </div>
                    <div className="room-item p-2 bg-[rgba(40,40,45,0.5)] rounded">
                      <h4 className="font-bold">Conservatory</h4>
                      <p className="text-sm">Filled with exotic plants and garden tools.</p>
                    </div>
                    <div className="room-item p-2 bg-[rgba(40,40,45,0.5)] rounded">
                      <h4 className="font-bold">Ballroom</h4>
                      <p className="text-sm">A large space with a grand piano.</p>
                    </div>
                    <div className="room-item p-2 bg-[rgba(40,40,45,0.5)] rounded">
                      <h4 className="font-bold">Kitchen</h4>
                      <p className="text-sm">Well-equipped with many potential weapons.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'weapons' && (
                <div>
                  <h2 className="text-[#3fad6c] font-bold text-xl mb-4 uppercase tracking-wider">Murder Weapons</h2>
                  <p className="text-[#eacda3] mb-4">
                    The following items were found in the mansion and could potentially be the murder weapon:
                  </p>
                  <div className="weapons-grid grid grid-cols-2 gap-4 mb-5">
                    <div className="weapon-item flex items-center bg-[rgba(40,40,45,0.5)] p-3 rounded">
                      <div className="weapon-icon mr-3 text-2xl">🔧</div>
                      <div>
                        <h4 className="text-[#f5e8d5] font-bold">Wrench</h4>
                        <p className="text-[#eacda3] text-sm">Found in the Conservatory. Heavy and capable of blunt force trauma.</p>
                      </div>
                    </div>
                    <div className="weapon-item flex items-center bg-[rgba(40,40,45,0.5)] p-3 rounded">
                      <div className="weapon-icon mr-3 text-2xl">🔪</div>
                      <div>
                        <h4 className="text-[#f5e8d5] font-bold">Knife</h4>
                        <p className="text-[#eacda3] text-sm">From the Kitchen. Sharp and potentially deadly.</p>
                      </div>
                    </div>
                    <div className="weapon-item flex items-center bg-[rgba(40,40,45,0.5)] p-3 rounded">
                      <div className="weapon-icon mr-3 text-2xl">🔫</div>
                      <div>
                        <h4 className="text-[#f5e8d5] font-bold">Revolver</h4>
                        <p className="text-[#eacda3] text-sm">Found in the Study. Loaded with one bullet missing.</p>
                      </div>
                    </div>
                    <div className="weapon-item flex items-center bg-[rgba(40,40,45,0.5)] p-3 rounded">
                      <div className="weapon-icon mr-3 text-2xl">🏆</div>
                      <div>
                        <h4 className="text-[#f5e8d5] font-bold">Trophy</h4>
                        <p className="text-[#eacda3] text-sm">From the Billiard Room. Heavy brass with blood traces.</p>
                      </div>
                    </div>
                    <div className="weapon-item flex items-center bg-[rgba(40,40,45,0.5)] p-3 rounded">
                      <div className="weapon-icon mr-3 text-2xl">🕯️</div>
                      <div>
                        <h4 className="text-[#f5e8d5] font-bold">Candlestick</h4>
                        <p className="text-[#eacda3] text-sm">From the Library. Heavy brass capable of deadly force.</p>
                      </div>
                    </div>
                    <div className="weapon-item flex items-center bg-[rgba(40,40,45,0.5)] p-3 rounded">
                      <div className="weapon-icon mr-3 text-2xl">🔗</div>
                      <div>
                        <h4 className="text-[#f5e8d5] font-bold">Rope</h4>
                        <p className="text-[#eacda3] text-sm">Found in the Ballroom. Could be used for strangulation.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'notes' && (
                <div>
                  <h2 className="text-[#eacda3] font-bold text-xl mb-4 uppercase tracking-wider">Detective's Notes</h2>
                  
                  {callHistory.length > 0 ? (
                    <div className="call-log text-left">
                      {callHistory.map((entry, idx) => (
                        <div key={idx} className="call-entry mb-5 p-4 bg-[rgba(40,30,15,0.7)] rounded border border-[rgba(212,180,131,0.3)]">
                          <div className="call-header flex justify-between items-center mb-2 border-b border-[rgba(212,180,131,0.2)] pb-2">
                            <span className={`font-bold text-lg ${entry.color}`}>{entry.suspect}</span>
                            <span className="text-[#eacda3] text-sm">{entry.startTime}</span>
                          </div>
                          <div className="call-info flex justify-between text-sm text-[#eacda3] mb-3">
                            <span>Duration: {entry.duration}</span>
                            <span className={`${entry.status === "Failed" ? "text-[#ff6b6b]" : "text-[#58a6ff]"}`}>
                              Status: {entry.status}
                            </span>
                          </div>
                          {entry.summary && (
                            <div className="call-summary mt-3">
                              <h4 className="text-[#f5e8d5] mb-2 font-semibold border-b border-[rgba(212,180,131,0.2)] pb-1">Alibi Summary:</h4>
                              <p className="text-[#eacda3] text-sm leading-relaxed italic">"{entry.summary}"</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-notes p-6 text-center bg-[rgba(40,30,15,0.4)] rounded border border-[rgba(212,180,131,0.2)]">
                      <p className="text-[#eacda3] italic">No suspect interviews have been recorded.</p>
                      <p className="text-[#eacda3] mt-2">Call the suspects to gather their alibis.</p>
                    </div>
                  )}
                  
                  {pendingSummaries.length > 0 && (
                    <div className="mt-4 p-3 bg-[rgba(255,66,66,0.1)] border border-[rgba(255,66,66,0.2)] rounded text-center">
                      <p className="text-[#eacda3] text-sm">
                        <span className="inline-block animate-pulse mr-2">🔍</span>
                        Analyzing {pendingSummaries.length} call recording{pendingSummaries.length > 1 ? 's' : ''}...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Bottom row - New Chief of Police direct line */}
        <div className="chief-line bg-[rgba(20,20,20,0.9)] p-5 rounded-lg shadow-[0px_0px_15px_rgba(88,166,255,0.4)] w-full flex flex-col">
          <div className="chief-header flex justify-between items-center mb-4 border-b border-[rgba(212,180,131,0.3)] pb-3">
            <div className="flex items-center">
              <div className="chief-badge text-2xl mr-3">👮‍♂️</div>
              <h2 className="text-[#f5e8d5] text-xl font-bold">DIRECT LINE TO CHIEF INSPECTOR</h2>
            </div>
            <div className="time-info text-right">
              <div className="current-time text-[#eacda3] text-lg font-bold">{formattedTime}</div>
              <div className="deadline text-[#ff6b6b] text-sm">
                Arrest Deadline: {deadline.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                <span className="ml-2">({hoursRemaining}h {minutesRemaining}m remaining)</span>
              </div>
            </div>
          </div>
          
          <div className="chief-content flex gap-5">
            <div className="chief-info w-1/2 text-left pr-4 border-r border-[rgba(212,180,131,0.3)]">
              <p className="text-[#eacda3] mb-3">
                <span className="text-[#f5e8d5] font-bold">CHIEF INSPECTOR GRAY:</span> Detective, time is running out. Based on your investigation, who do you believe murdered Mr. Black? When you're ready to make your accusation, contact me immediately.
              </p>
              <p className="text-[#eacda3] mb-3">
                Remember, we only get one chance at an arrest warrant. If you accuse the wrong person, the real killer will escape justice and likely flee the country.
              </p>
              {chiefMessage && (
                <div className={`mt-3 p-3 rounded ${accusationSubmitted ? "bg-[rgba(63,173,108,0.2)] border border-[rgba(63,173,108,0.4)]" : "bg-[rgba(255,66,66,0.1)] border border-[rgba(255,66,66,0.2)]"}`}>
                  <p className="text-[#f5e8d5]">{chiefMessage}</p>
                </div>
              )}
            </div>
            
            <div className="accusation-form w-1/2">
              <div className="form-group mb-4">
                <label htmlFor="accusation" className="block text-[#f5e8d5] text-left mb-2 font-bold">
                  MAKE YOUR ACCUSATION:
                </label>
                <select 
                  id="accusation"
                  value={accusation}
                  onChange={(e) => setAccusation(e.target.value)}
                  disabled={accusationSubmitted}
                  className="w-full p-3 bg-[#1a1a1a] border border-[#d4b483] text-[#eacda3] rounded"
                >
                  <option value="">Select the murderer...</option>
                  {suspects.map(suspect => (
                    <option key={suspect.id} value={suspect.name}>
                      {suspect.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group mb-4">
                <label htmlFor="weapon" className="block text-[#f5e8d5] text-left mb-2 font-bold">
                  MURDER WEAPON:
                </label>
                <select 
                  id="weapon"
                  value={selectedWeapon}
                  onChange={(e) => setSelectedWeapon(e.target.value)}
                  disabled={accusationSubmitted}
                  className="w-full p-3 bg-[#1a1a1a] border border-[#d4b483] text-[#eacda3] rounded"
                >
                  <option value="">Select the weapon...</option>
                  <option value="Wrench">Wrench</option>
                  <option value="Knife">Knife</option>
                  <option value="Revolver">Revolver</option>
                  <option value="Trophy">Trophy</option>
                  <option value="Candlestick">Candlestick</option>
                  <option value="Rope">Rope</option>
                </select>
              </div>
              
              <button
                onClick={handleAccusation}
                disabled={accusationSubmitted}
                className={`mt-2 w-full py-3 px-4 rounded font-bold text-lg uppercase 
                  ${accusationSubmitted 
                    ? "bg-[rgba(63,173,108,0.7)] text-white cursor-not-allowed" 
                    : "bg-[#ff4242] text-white hover:bg-[#ff6464] cursor-pointer"}`}
              >
                {accusationSubmitted ? "WARRANT ISSUED" : "SUBMIT ACCUSATION"}
              </button>
              
              {accusationSubmitted && (
                <p className="mt-3 text-[#3fad6c] text-sm">
                  Your accusation has been filed and officers dispatched.
                </p>
              )}
              
              {accusationSubmitted && (
                <div className="mt-4 p-4 bg-[rgba(63,173,108,0.15)] border border-[rgba(63,173,108,0.3)] rounded">
                  <h3 className="text-[#f5e8d5] font-bold text-xl mb-2">Warrant Issued</h3>
                  
                  <div className="call-status mb-3">
                    {chiefCallActive ? (
                      <div className="flex items-center">
                        <span className="mr-2 inline-block animate-pulse">📞</span>
                        <div>
                          <p className="text-[#eacda3]">Chief Inspector Gray is calling...</p>
                          <p className="text-[#eacda3] text-sm">{chiefCallStatus}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[#3fad6c]">
                        {chiefCallId ? "Call with Chief Inspector completed." : "Preparing for Chief Inspector's call..."}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-[#eacda3] text-sm bg-[rgba(0,0,0,0.2)] p-3 rounded">
                    <p className="mb-2"><span className="text-[#f5e8d5]">Your accusation:</span> {accusation} with the {selectedWeapon}</p>
                    <p className="italic">The Chief Inspector will evaluate your evidence and reasoning during the call.</p>
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>

        {/* Privacy Footer */}
        <div className="privacy-footer text-center mt-6 mb-4 w-full px-4 max-w-[1025px]">
          <div className="privacy-content p-3 bg-[rgba(30,30,35,0.6)] rounded border border-[rgba(212,180,131,0.2)]">
            <p className="text-[#eacda3] text-xs mb-2">
              <strong>Privacy Notice:</strong> All conversations during phone calls are logged to Bland.ai's API. Your phone number is used only to connect calls.
            </p>
            <p className="text-[#eacda3] text-xs">
              All data processing and voice generation is handled by Bland.ai. See <a href="https://www.bland.ai/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] underline hover:text-[#79b6ff]">Bland.ai's Privacy Policy</a> for details.
            </p>
          </div>
          <div className="attribution mt-2 text-xs text-[#a0a0a0]">
            Educational Demo, characters etc owned by Hasbro and all rights reserved | Built by <a href="http://benjgorman.com" className="text-[#a0a0a0] underline hover:text-[#eacda3]">Benjamin Gorman </a>
          </div>
        </div>
      </div>
    </div>
  );
}
