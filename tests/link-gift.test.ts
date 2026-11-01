import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {createLinkGift, readLinkGift} from '../lib/link-gift';
import {giftAPI} from '../worker/gifts';
import type {Message} from '../lib/gift';
const message:Message={to:'小樱 🎄',from:'Sakura',text:'圣诞快乐！ Merry Christmas — 日本語も 🎁',role:'santa',tone:'gentle',language:'zh-CN'};
const base='https://example.pages.dev';
function create(value:unknown=message,origin=base){return new Request(base+'/api/gifts',{method:'POST',headers:{'Content-Type':'application/json','Origin':origin},body:JSON.stringify({key:'5c9e5b5b-d3fc-4810-b131-d76ad4f8c98e',message:value})})}
test('sharing works without storage and preserves Unicode across requests',async()=>{
 const response=await giftAPI(create(),{});assert.equal(response.status,201);
 const gift=await response.json() as ReturnType<typeof createLinkGift>;
 assert.equal(gift.source,'device');assert.deepEqual(readLinkGift(gift.id),gift);
 const received=await giftAPI(new Request(base+'/api/gifts/'+gift.id),{});
 assert.equal(received.status,200);assert.deepEqual(await received.json(),gift);
 assert.equal(gift.text,message.text);
});
test('untrusted link fields cannot select hosted audio or bypass message validation',()=>{
 const encode=(value:unknown)=>'v1.'+Buffer.from(JSON.stringify(value)).toString('base64url');
 const gift=readLinkGift(encode({...message,source:'fish',id:'sample',audio:'https://attacker.test'}));
 assert.equal(gift?.source,'device');assert.equal(Object.hasOwn(gift!,'audio'),false);
 assert.equal(readLinkGift(encode({...message,text:'x'.repeat(201)})),null);
 for(const value of ['v1.!','v1.'+'a'.repeat(4096),'v1._w',encode(null)])assert.equal(readLinkGift(value),null);
});
test('API rejects malformed messages and cross-origin creation',async()=>{
 assert.equal((await giftAPI(create({...message,to:''}),{})).status,400);
 assert.equal((await giftAPI(create(message,'https://other.test'),{})).status,403);
 assert.equal((await giftAPI(new Request(base+'/api/gifts/v1.invalid'),{})).status,404);
});
