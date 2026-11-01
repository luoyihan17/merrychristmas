import {valid, type Gift, type Message} from "./gift";

// Self-contained links keep sharing available without a storage subscription.
// These are messages, not authentication tokens; recipients can read their content.
const prefix = "v1.";
const maxTokenLength = 4096;

function clean(message: Message): Message {
  const {to, from, text, role, tone, language} = message;
  return {to, from, text, role, tone, ...(language ? {language} : {})};
}

export function createLinkGift(message: Message): Gift {
  if (!valid(message)) throw new Error("Invalid gift message");
  const value = clean(message);
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  const encoded = btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return {...value, id: prefix + encoded, source: "device"};
}

export function readLinkGift(id: string): Gift | null {
  if (id.length > maxTokenLength || !/^v1\.[A-Za-z0-9_-]+$/.test(id)) return null;
  try {
    const encoded = id.slice(prefix.length).replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(encoded), char => char.charCodeAt(0));
    const value: unknown = JSON.parse(new TextDecoder("utf-8", {fatal: true}).decode(bytes));
    if (!valid(value)) return null;
    // Never trust a voice source, audio URL, or other extra fields in a shared URL.
    return {...clean(value), id, source: "device"};
  } catch {
    return null;
  }
}
