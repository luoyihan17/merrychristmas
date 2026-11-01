import {env} from "cloudflare:workers";
import Studio from "./Studio";
import {PostPreview} from "./MailDispatch";
import {sample} from "../lib/sample";
import type {Gift} from "../lib/gift";
export const dynamic="force-dynamic";
export default async function Page({searchParams}:{searchParams:Promise<{gift?:string;preview?:string}>}){
 const {gift,preview}=await searchParams;
 if(!gift&&preview==="post")return <PostPreview/>;
 if(!gift)return <Studio/>;
 if(gift==="sample")return <Studio initial={sample}/>;
 if(typeof gift!=="string"||!/^[0-9a-f-]{36}$/.test(gift))return <Studio missing/>;
 try{const obj=await env.BUCKET?.get("gift/"+gift);return obj?<Studio initial={await obj.json<Gift>()}/>:<Studio missing/>}
 catch{return <Studio missing/>}
}
