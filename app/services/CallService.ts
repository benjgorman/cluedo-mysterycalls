// API key and endpoints
const API_KEY = import.meta.env.VITE_BLAND_AI_API_KEY;
const BASE_URL = "https://api.bland.ai/v1/calls";
const US_BASE_URL = "https://us.api.bland.ai/v1/calls";

// Types
export interface Suspect {
  name: string;
  id: string;
  color?: string;
  image?: string;
  voice_id?: string;
}

export interface CallLogEntry {
  suspect: string;
  callId: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: string;
  color: string;
  summary?: string;
}

interface CallResponse {
  call_id?: string;
  status?: string;
  summary?: string;
  transcript?: string;
  error?: string;
}

// Initiate a call to a suspect
export async function initiateSuspectCall(
  phoneNumber: string, 
  suspect: Suspect
): Promise<CallResponse> {
  try {
    const options = {
      method: "POST",
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number: phoneNumber,
        task: `Call from ${suspect.name}`,
        pathway_id: suspect.id,
        voice: suspect.voice_id
      }),
    };

    const response = await fetch(US_BASE_URL, options);
    return await response.json();
  } catch (error) {
    console.error("Error initiating suspect call:", error);
    return { error: (error as Error).message || "Failed to initiate call" };
  }
}

// Check status of any call
export async function checkCallStatus(callId: string): Promise<CallResponse> {
  try {
    const response = await fetch(`${BASE_URL}/${callId}`, {
      method: "GET",
      headers: {
        Authorization: API_KEY,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error checking call status:", error);
    return { error: (error as Error).message || "Failed to check call status" };
  }
}

// Initiate a call with the Chief Inspector
export async function initiateChiefCall(
  phoneNumber: string,
  accusation: string,
  selectedWeapon: string
): Promise<CallResponse> {
  try {
    const options = {
      method: "POST",
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number: phoneNumber,
        task: `Call from Chief Inspector Gray regarding the accusation against ${accusation} with the ${selectedWeapon}`,
        initial_message: `Hello detective. This is Chief Inspector Gray. I've received your arrest warrant for ${accusation} using the ${selectedWeapon} as the murder weapon. I need you to walk me through your evidence and reasoning. Why do you believe ${accusation} is guilty? What evidence links them to the crime scene? And how did they use the ${selectedWeapon}?`
      }),
    };

    const response = await fetch(US_BASE_URL, options);
    return await response.json();
  } catch (error) {
    console.error("Error initiating chief call:", error);
    return { error: (error as Error).message || "Failed to initiate chief call" };
  }
}

// Calculate duration between start and end times
export function calculateCallDuration(startTime: Date, endTime: Date): string {
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationSec = Math.floor(durationMs / 1000);
  const minutes = Math.floor(durationSec / 60);
  const seconds = durationSec % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Extract summary from call data 
export function extractSummaryFromCall(data: CallResponse): string {
  if (data.summary) {
    return data.summary;
  } else if (data.transcript && data.transcript.length > 0) {
    return data.transcript.slice(0, 150) + "...";
  }
  return "";
}

// Create a call log entry
export function createCallLogEntry(
  suspect: string,
  callId: string,
  startTime: Date,
  endTime: Date,
  status: string = "Completed",
  color: string = "",
  summary: string = ""
): CallLogEntry {
  return {
    suspect,
    callId,
    startTime: startTime.toLocaleTimeString(),
    endTime: endTime.toLocaleTimeString(),
    duration: calculateCallDuration(startTime, endTime),
    status,
    color,
    summary: summary || "Generating summary..."
  };
}