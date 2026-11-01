import {languages} from "../lib/languages";
const respond=(body:unknown,status=200)=>Response.json(body,{status,headers:{"Cache-Control":"no-store","Referrer-Policy":"no-referrer"}});
function chunks(value:string){
 const encoder=new TextEncoder(),out:string[]=[];let chunk="";
 for(const part of value.match(/\s+|[^\s。！？.!?]+[。！？.!?]*|[。！？.!?]+/gu)??[]){
  if(encoder.encode(chunk+part).length<=500){chunk+=part;continue}
  if(chunk.trim())out.push(chunk.trim());chunk="";
  for(const ch of part){if(encoder.encode(chunk+ch).length>500){out.push(chunk);chunk=""}chunk+=ch}
 }
 if(chunk.trim())out.push(chunk.trim());return out;
}
export async function translateAPI(request:Request){
 if(request.method!=="POST" || !request.headers.get("content-type")?.startsWith("application/json"))return respond({},405);
 if(request.headers.get("origin") && request.headers.get("origin")!==new URL(request.url).origin)return respond({},403);
 const reader=request.body?.getReader();if(!reader)return respond({},400);
 let bytes=0,raw="";const decoder=new TextDecoder();
 while(true){const {value,done}=await reader.read();if(done)break;bytes+=value.length;if(bytes>4096){await reader.cancel();return respond({},413)}raw+=decoder.decode(value,{stream:true})}
 let body;try{body=JSON.parse(raw+decoder.decode())}catch{return respond({},400)}
 if(!body||typeof body.text!=="string"||!body.text.trim()||body.text.length>650||!Object.hasOwn(languages,body.from)||!Object.hasOwn(languages,body.to)||body.from===body.to)return respond({},400);
 const translated=[];const timeout=AbortSignal.timeout(16000);
 for(const part of chunks(body.text)){
  const url=new URL("https://api.mymemory.translated.net/get");url.searchParams.set("q",part);url.searchParams.set("langpair",body.from+"|"+body.to);
  const upstream=await fetch(url,{signal:timeout});
  if(!upstream.ok)return respond({},upstream.status===429?429:502);
  const data=await upstream.json() as {quotaFinished?:boolean;responseStatus?:number|string;responseData?:{translatedText?:string}};
  if(data.quotaFinished||Number(data.responseStatus)===429)return respond({},429);
  const text=data.responseData?.translatedText;
  if(Number(data.responseStatus)!==200||!text?.trim())return respond({},502);
  translated.push(text);
 }
 return respond({text:translated.join(" ")});
}
