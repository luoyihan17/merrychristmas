import {valid, type Gift,type Message} from "../lib/gift";
type Config = { BUCKET?: R2Bucket; FISH_API_KEY?:string; FISH_MODEL?:string; FISH_SANTA_VOICE_ID?:string; FISH_ELF_VOICE_ID?:string };
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
const fail=(s:string,status:number)=>json({error:s},status);
const idPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const upstream:Record<number,string>={401:"Fish Audio authentication failed. Check the server key.",403:"This account cannot access the selected voice or model.",402:"Fish Audio quota is unavailable. Check free tier eligibility.",404:"This voice or model is unavailable. Check the server configuration.",422:"Fish Audio could not accept this voice or text.",429:"The free line is busy. Please try again later."};
export async function giftAPI(req:Request, cfg:Config):Promise<Response>{
  const url=new URL(req.url), parts=url.pathname.split("/").filter(Boolean).slice(2);
  const bucket=cfg.BUCKET;
  if(!bucket) return fail("Gift storage is unavailable. Please try again.",503);
  if(req.method==="GET" && parts.length>0 && idPattern.test(parts[0])){
    const audio=parts[1]==="audio";
    if(parts.length!==(audio?2:1))return fail("Call not found.",404);
    const range=audio?req.headers.get("range"):null;
    const objectKey=(audio?"audio/":"gift/")+parts[0];
    let slice:{offset:number;length:number}|undefined;
    if(range){
      const obj=await bucket.head(objectKey);
      if(!obj)return fail("Recording not found.",404);
      const match=/^bytes=(\d*)-(\d*)$/.exec(range);
      if(!match||(!match[1]&&!match[2]))return new Response(null,{status:416,headers:{"Content-Range":"bytes */"+obj.size}});
      const start=match[1]?Number(match[1]):Math.max(0,obj.size-Number(match[2]));
      const end=match[1]&&match[2]?Math.min(Number(match[2]),obj.size-1):obj.size-1;
      if(start>end)return new Response(null,{status:416,headers:{"Content-Range":"bytes */"+obj.size}});
      slice={offset:start,length:end-start+1};
    }
    const file=await bucket.get(objectKey,slice?{range:slice}:undefined);
    if(!file)return fail("Call not found. Check your shared link.",404);
    const headers=new Headers({"Content-Type":audio?"audio/mpeg":"application/json; charset=utf-8","Content-Length":String(slice?.length??file.size),"Cache-Control":"private, max-age=3600","X-Content-Type-Options":"nosniff"});
    if(audio)headers.set("Accept-Ranges","bytes");
    if(slice)headers.set("Content-Range","bytes "+slice.offset+"-"+(slice.offset+slice.length-1)+"/"+file.size);
    return new Response(file.body,{status:slice?206:200,headers});
  }
  if(req.method!=="POST" || parts.length) return fail("Line not found.",404);
  if(req.headers.get("origin") && req.headers.get("origin")!==url.origin)return fail("Create your call on this site.",403);
  if(!req.headers.get("Content-Type")?.startsWith("application/json"))return fail("Invalid request format.",415);
  if(Number(req.headers.get("Content-Length"))>8192)return fail("Request too long.",413);
  const reader=req.body?.getReader();if(!reader)return fail("A message is required.",400);
  let raw="", bytes=0;const decoder=new TextDecoder();
  while(true){const {value,done}=await reader.read();if(done)break;bytes+=value.length;if(bytes>8192){await reader.cancel();return fail("Request too long.",413)}raw+=decoder.decode(value,{stream:true})}
  let body;try{body=JSON.parse(raw+decoder.decode())}catch{return fail("Invalid request format.",400)}
  if(!valid(body?.message)||!idPattern.test(String(body?.key)))return fail("Add both names and a message of up to 200 characters.",400);
  const {to,from,text,role,tone,language}=body.message as Message, key=body.key;
  const lock="lock/"+key, saved="gift/"+key;
  const old=await bucket.get(saved);
  if(old){const gift=await old.json<Gift>();return gift.to===to&&gift.from===from&&gift.text===text&&gift.role===role&&gift.tone===tone&&gift.language===language?json(gift):fail("This version is sealed. Please generate a new one.",409)}
  let current=await bucket.head(lock);
  if(current && Date.now()-current.uploaded.getTime()<120_000)return fail("This call is still being prepared. Try again shortly.",409);
  const acquired=await bucket.put(lock,"1",{onlyIf:current?{etagMatches:current.etag}:{etagDoesNotMatch:"*"}});
  if(!acquired)return fail("This call is still being prepared. Try again shortly.",409);
  try{
    const existing=await bucket.get(saved);if(existing)return json(await existing.json());
    const voice=role==="santa"?cfg.FISH_SANTA_VOICE_ID:cfg.FISH_ELF_VOICE_ID;
    const real=Boolean(cfg.FISH_API_KEY&&voice);
    const gift:Gift={id:key,to,from,text,role,tone,language,source:real?"fish":"device"};
    if(real){
      const model=cfg.FISH_MODEL??"s2.1-pro-free";
      if(model!=="s2.1-pro-free")return fail("Only the free model is enabled. Check FISH_MODEL.",503);
      // An atomic per-network daily ceiling bounds anonymous upstream calls.
      const ip=req.headers.get("cf-connecting-ip")||"local";
      const digest=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(ip+"|"+new Date().toISOString().slice(0,10))))).map(b=>b.toString(16).padStart(2,"0")).join("");
      const slot="quota/"+digest; const quota=await bucket.get(slot);
      const n=quota?Number(await quota.text()):0;
      if(n>=15 || !await bucket.put(slot,String(n+1),{onlyIf:quota?{etagMatches:quota.etag}:{etagDoesNotMatch:"*"}}))return fail("Too many calls from this network. Try again later.",429);
      const res=await fetch("https://api.fish.audio/v1/tts",{method:"POST",headers:{Authorization:"Bearer "+cfg.FISH_API_KEY,"Content-Type":"application/json",model},body:JSON.stringify({text,...(language?{language}:{}),reference_id:voice,format:"mp3",prosody:{speed:{gentle:0.93,playful:1.02,cheer:1.07}[tone]}}),signal:AbortSignal.timeout(55000)});
      if(!res.ok)return fail(upstream[res.status]||"Fish Audio is unavailable. Try again later.",res.status>=500?503:res.status);
      if(!/audio|octet-stream/i.test(res.headers.get("content-type")||""))return fail("No valid audio was received. Please try again.",502);
      const data=await res.arrayBuffer();if(data.byteLength<32)return fail("The recording is incomplete. Please try again.",502);
      await bucket.put("audio/"+key,data,{httpMetadata:{contentType:"audio/mpeg"}});
    }
    await bucket.put(saved,JSON.stringify(gift),{onlyIf:{etagDoesNotMatch:"*"}});
    return json(gift,201);
  }catch(e){return fail(e instanceof Error && /timeout|abort/i.test(e.name)?"Voice generation timed out. Your draft is saved. Please try again.":"The North Pole line was interrupted. Your draft is saved. Please try again.",503)}
  finally{await bucket.delete(lock)}
}
