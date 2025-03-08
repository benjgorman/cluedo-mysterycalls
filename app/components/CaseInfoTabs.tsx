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
            
            <div className="p-4 bg-[rgba(40,40,45,0.5)] border border-[rgba(255,66,66,0.2)] rounded">
              <div className="ml-3">
                <h3 className="text-[#f5e8d5] font-bold mb-2 flex items-center">
                  <span className="mr-2 text-lg">📋</span> Crime Scene Report
                </h3>
                <p className="text-[#eacda3] mb-3">
                  On March 6th, at approximately 9:30 PM, the body of Mr. Black was discovered in the Dining Room of Black Manor. 
                  The butler, Mr. Jameson, located the victim while clearing the dining area and contacted authorities immediately.
                </p>
                <p className="text-[#eacda3] mb-3">
                  Mr. Black hosted a dinner party that evening, attended by six guests. All were present in the manor 
                  at the time of death, none of them were found in the dining room by Mr Jameson. The victim was found on the floor near the dining table, not in the position 
                  where he had been seated. A chair was knocked over nearby, indicating a struggle.
                </p>
                <p className="text-[#eacda3] mb-3">
                  Surrounding the body were broken glass, overturned candlesticks, and melted candle wax. The dining 
                  room door was locked when Mr. Jameson arrived and required his key to enter.
                </p>
              </div>

            <h3 className="text-[#f5e8d5] font-bold mb-3 mt-5">Additional Clues</h3>

              <ul className="list-disc pl-5 text-[#eacda3]">
                <li className="mb-2">A shattered wine glass was located near the victim's right hand.</li>
                <li className="mb-2">Multiple guests reported hearing a loud impact at approximately 9:15 PM, followed by silence.</li>
                <li className="mb-2">No signs of forced entry or struggle were observed outside the dining room.</li>
                <li className="mb-2">While candlesticks were found overturned, none appeared to have blood on them.</li>
                <li className="mb-2">All six guests had the opportunity to commit the crime.</li>
              </ul>
            </div>
            
            <h3 className="text-[#f5e8d5] font-bold mb-2 mt-4 flex items-center">
              <span className="mr-2 text-lg">🩸</span> Coroner's Findings
            </h3>
            <div className="p-4 bg-[rgba(255,66,66,0.1)] border border-[rgba(255,66,66,0.2)] rounded">
              <h3 className="text-[#ff4242] font-bold mb-1">Coroner's Report</h3>
              <p className="text-[#eacda3] text-sm italic">
                "The victim sustained a fatal blow to the head, resulting in likley immediate death. 
                The wound is consistent with impact from a heavy, blunt object. The angle of impact 
                suggests the victim was either seated or in the process of standing at the time of the attack.
                From the nature of the wound, I believe the murder weapon was wielded with considerable force."
              </p>
            </div>
            
            <h3 className="text-[#f5e8d5] font-bold mb-3 mt-5 flex items-center">
              <span className="mr-2 text-lg">👥</span> Suspects & Motives
            </h3>
            <p className="text-[#eacda3] mb-3">
              The following individuals were present at the time of the incident:
            </p>
            
            <div className="grid grid-cols-1 gap-3 mb-5">
              <div className="suspect-item p-3 bg-[rgba(40,40,45,0.5)] rounded border-l-[6px] border-[#FF2400] ml-2">
                <div className="ml-3">
                  <h4 className="font-bold text-scarlet">Miss Scarlet</h4>
                  <p className="text-[#eacda3] text-sm">Business rival of Mr. Black. Recent news articles report disputes over a failed investment, which resulted in financial loss for Scarlet. Left the dining room briefly and returned appearing pale.</p>
                </div>
              </div>
              
              <div className="suspect-item p-3 bg-[rgba(40,40,45,0.5)] rounded border-l-[6px] border-[#E49B0F] ml-2">
                <div className="ml-3">
                  <h4 className="font-bold text-mustard">Colonel Mustard</h4>
                  <p className="text-[#eacda3] text-sm">Former military associate. Borrowed a substantial amount of money from Mr. Black many years ago. The victim had been pressing for repayment - but mostly as a continued joke as he knew Mustard was only now recieving his military pension. His hands contained traces of wax (allegedly from polishing his boots...).</p>
                </div>
              </div>
              
              <div className="p-4 suspect-item p-3 bg-[rgba(40,40,45,0.5)] rounded border-l-[6px] border-[#FFFFFF] ml-2">
                <div className="ml-3">
                  <h4 className="font-bold text-white">Mrs. White</h4>
                  <p className="text-[#eacda3] text-sm">Housekeeper. Long suffering worker - although known to be fond of Black. Reported seeing a shadow moving past the hallway moments before discovery of the body.</p>
                </div>
              </div>
              
              <div className="suspect-item p-3 bg-[rgba(40,40,45,0.5)] rounded border-l-[6px] border-[#00A550] ml-2">
                <div className="ml-3">
                  <h4 className="font-bold text-green">Mr. Green</h4>
                  <p className="text-[#eacda3] text-sm">Personal accountant. Financial records indicate discrepancies suggesting possible embezzlement? Displayed signs of nervousness when questioned on night, frequently adjusting his tie.</p>
                </div>
              </div>
              
              <div className="suspect-item p-3 bg-[rgba(40,40,45,0.5)] rounded border-l-[6px] border-[#3F85CD] ml-2">
                <div className="ml-3">
                  <h4 className="font-bold text-peacock">Mrs. Peacock</h4>
                  <p className="text-[#eacda3] text-sm">Neighbor and foul-mouthed socialite. Witnesses recall an argument earlier with Black in the evening.</p>
                </div>
              </div>
              
              <div className="suspect-item p-3 bg-[rgba(40,40,45,0.5)] rounded border-l-[6px] border-[#8E4585] ml-2">
                <div className="ml-3">
                  <h4 className="font-bold text-plum">Professor Plum</h4>
                  <p className="text-[#eacda3] text-sm">Academic colleague. Professional rivalry with Mr. Black. Recent grant proposal was not successful - Black was on external committee.</p>
                </div>
              </div>
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
              The mansion contains 8 key rooms where the murder could have taken place:
            </p>
            <div className="grid grid-cols-2 gap-3 text-[#eacda3]">
              <div className="room-item p-2 bg-[rgba(40,40,45,0.5)] rounded">
                <h4 className="font-bold">Study</h4>
                <p className="text-sm">Where Mr Black spent most of his hours. Contains a desk, bookshelves, and a fireplace.</p>
              </div>
              <div className="room-item p-2 bg-[rgba(40,40,45,0.5)] rounded">
                <h4 className="font-bold">Library</h4>
                <p className="text-sm">Filled with rare books and a large reading table.</p>
              </div>
              <div className="room-item p-2 bg-[rgba(40,40,45,0.5)] rounded">
                <h4 className="font-bold">Dining Room</h4>
                <p className="text-sm">Contains a large antique table adorned with candles and priceless silerware.</p>
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
                <h4 className="font-bold">Lounge</h4>
                <p className="text-sm">A comfortable room with luxirous sofas and high-end cinema sound-system.</p>
              </div>
              <div className="room-item p-2 bg-[rgba(40,40,45,0.5)] rounded">
                <h4 className="font-bold">Ballroom</h4>
                <p className="text-sm">A large space with a grand piano.</p>
              </div>
              <div className="room-item p-2 bg-[rgba(40,40,45,0.5)] rounded">
                <h4 className="font-bold">Kitchen</h4>
                <p className="text-sm">Well-equipped with many high-end culinary equipment.</p>
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
                  <p className="text-[#eacda3] text-sm">Found in the Conservatory. Heavy and capable of blunt force trauma. Rusted with signs of recent cleaning.</p>
                </div>
              </div>
              <div className="weapon-item flex items-center bg-[rgba(40,40,45,0.5)] p-3 rounded">
                <div className="weapon-icon mr-3 text-2xl">🔪</div>
                <div>
                  <h4 className="text-[#f5e8d5] font-bold">Knife</h4>
                  <p className="text-[#eacda3] text-sm">From the Kitchen. Sharp and potentially deadly. Well used, should be replaced...</p>
                </div>
              </div>
              <div className="weapon-item flex items-center bg-[rgba(40,40,45,0.5)] p-3 rounded">
                <div className="weapon-icon mr-3 text-2xl">🔫</div>
                <div>
                  <h4 className="text-[#f5e8d5] font-bold">Revolver</h4>
                  <p className="text-[#eacda3] text-sm">Used for sport? Found in the Study. Loaded with one bullet missing.</p>
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
                  <p className="text-[#eacda3] text-sm">From the Library. Heavy brass capable of deadly force. Signs of damage potentially from cleaning off old wax.</p>
                </div>
              </div>
              <div className="weapon-item flex items-center bg-[rgba(40,40,45,0.5)] p-3 rounded">
                <div className="weapon-icon mr-3 text-2xl">🔗</div>
                <div>
                  <h4 className="text-[#f5e8d5] font-bold">Rope</h4>
                  <p className="text-[#eacda3] text-sm">Found in the Ballroom. Could be used for strangulation?</p>
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