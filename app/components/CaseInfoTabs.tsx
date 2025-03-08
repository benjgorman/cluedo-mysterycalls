import React from 'react';

interface CallLogEntry {
  suspect: string;
  callId: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: string;
  color: string;
  summary?: string;
}

interface CaseInfoTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  callHistory: CallLogEntry[];
  pendingSummaries: string[];
}

const CaseInfoTabs: React.FC<CaseInfoTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  callHistory,
  pendingSummaries
}) => {
  return (
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
  );
};

export default CaseInfoTabs;