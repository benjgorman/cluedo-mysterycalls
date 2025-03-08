import React from 'react';

interface PhoneNumberPanelProps {
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  showNumber: boolean;
  setShowNumber: (show: boolean) => void;
}

const PhoneNumberPanel: React.FC<PhoneNumberPanelProps> = ({
  phoneNumber,
  setPhoneNumber,
  showNumber,
  setShowNumber
}) => {
  return (
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
  );
};

export default PhoneNumberPanel;