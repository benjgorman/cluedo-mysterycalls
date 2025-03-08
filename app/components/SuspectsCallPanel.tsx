import React from "react";

interface Suspect {
  id: string;
  name: string;
  image: string;
  color: string;
}

interface SuspectsCallPanelProps {
  suspects: Suspect[];
  activeSuspect: string | null;
  handleCall: (suspect: Suspect) => void;
}

export default function SuspectsCallPanel({ 
  suspects, 
  activeSuspect, 
  handleCall 
}: SuspectsCallPanelProps) {
  return (
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
  );
}