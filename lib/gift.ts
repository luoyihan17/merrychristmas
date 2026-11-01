import {languages} from "./languages";
export const roles = { santa: "Santa Claus", elf: "Pip the Elf" } as const;
export const tones = { playful: "Playful", gentle: "Tender", cheer: "Pep talk" } as const;
export type Role = keyof typeof roles;
export type Tone = keyof typeof tones;
export type Message = {to: string; from: string; role: Role; tone: Tone; text: string; language?:string};
export type Gift = Message & {id: string; source: "fish" | "device" | "sample"};
export type Draft = Message & { detail: string; wish: string; variant: number; custom: boolean; reply: boolean };
export const wishes = ["More time together", "Good news", "A little rest"];
export const wishText = ["Here’s to more time together.", "May good news find you soon.", "I hope you get a lovely, lazy morning."];
export const blank = (): Draft => ({to:"",from:"",role:"santa",tone:"gentle",text:"",detail:"",wish:wishText[0],variant:0,custom:false,reply:false});

export function script(d: Draft) {
  const to = d.to.trim() || "friend";
  const from = d.from.trim() || "a friend";
  const caller = d.role === "santa" ? "Santa" : "Pip the Elf";
  const wish = d.wish.trim() || "Have a very merry Christmas.";
  const detail = d.detail.trim();
  const open = {
    playful: ["Psst, " + to + "! " + caller + " here.", "Is this " + to + "? Don’t tell the reindeer I called.", "Special delivery for " + to + "!"],
    gentle: ["Hello, " + to + ". It’s " + caller + ".", "I have a little Christmas note for you, " + to + ".", "Is that you, " + to + "? It’s quiet here at the North Pole."],
    cheer: ["Hey, " + to + "! " + caller + " here, cheering you on.", "Three cheers for " + to + " from the North Pole!", "Good news, " + to + "! You made the nice list."]
  };
  const lead = open[d.tone][d.variant % 3];
  const memory = detail ? from + " left me this note: “" + detail + "”" : from + " wanted you to hear a familiar voice this Christmas.";
  const replies = [
    to + ", " + from + " got your call and sent one back!",
    "A return call for " + to + "! " + from + " asked me to ring you.",
    "Hello again, " + to + ". I have a thank-you from " + from + "."
  ];
  const main = d.reply ? replies[d.variant % 3] : lead;
  const body = [main, d.reply ? detail : memory, wish].filter(Boolean).join(" ");
  if (body.length <= 200) return body;
  return [to + ",", detail, wish, "— " + from].filter(Boolean).join(" ");
}
export const message=(d:Draft):Message=>({...(d.custom&&d.language?{language:d.language}:{}),to:d.to.trim(),from:d.from.trim(),role:d.role,tone:d.tone,text:(d.custom?d.text:script(d)).trim()});
export function valid(m:unknown):m is Message {
  if(!m || typeof m!=="object") return false;
  const v=m as Message;
  return [v.to,v.from,v.text].every((s,i)=>typeof s==="string" && s.trim().length>0 && s.length<=[20,20,200][i]) && (v.language===undefined || Object.hasOwn(languages,v.language)) && Object.hasOwn(roles,v.role) && Object.hasOwn(tones,v.tone);
}
