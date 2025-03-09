import React from 'react';

interface Suspect {
  id: string;
  name: string;
  image: string;
  color: string;
}

interface ChiefInspectorSectionProps {
  formattedTime: string;
  deadline: Date;
  hoursRemaining: number;
  minutesRemaining: number;
  chiefMessage: string;
  accusationSubmitted: boolean;
  accusation: string;
  selectedWeapon: string;
  suspects: Suspect[];
  chiefCallActive: boolean;
  chiefCallStatus: string;
  chiefCallId: string;
  handleAccusation: () => void;
  setAccusation: (value: string) => void;
  setSelectedWeapon: (value: string) => void;
}

const ChiefInspectorSection: React.FC<ChiefInspectorSectionProps> = ({
  formattedTime,
  deadline,
  hoursRemaining,
  minutesRemaining,
  chiefMessage,
  accusationSubmitted,
  accusation,
  selectedWeapon,
  suspects,
  chiefCallActive,
  chiefCallStatus,
  chiefCallId,
  handleAccusation,
  setAccusation,
  setSelectedWeapon
}) => {
  return (
    <div className="chief-line bg-[rgba(20,20,20,0.9)] p-5 rounded-lg shadow-[0px_0px_15px_rgba(88,166,255,0.4)] w-full flex flex-col">
      <div className="chief-header flex justify-between items-center mb-4 border-b border-[rgba(212,180,131,0.3)] pb-3">
        <div className="flex items-center">
          <div className={`chief-badge ${chiefCallActive ? "animate-pulse" : ""}`}>
            <img 
              src="images/gray.png" 
              alt="Chief Inspector Gray" 
              className={`chief-inspector-image ${chiefCallActive ? "border-[#3fad6c]" : "border-[#d4b483]"}`}
            />
          </div>
          <h2 className="text-[#f5e8d5] text-xl font-bold">
            DIRECT LINE TO CHIEF INSPECTOR
            {chiefCallActive && <span className="ml-2 text-[#3fad6c] animate-pulse">• LIVE</span>}
          </h2>
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
  );
};

export default ChiefInspectorSection;