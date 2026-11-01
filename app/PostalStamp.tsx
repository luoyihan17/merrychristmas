import {useId} from "react";

/** Two-colour relief print. Gaps in the ink form the branches and snow. */
export function PostalStamp(){
 const id=useId().replace(/:/g,""),paper="#f5e9cb",green="#254139",red="#a83a32";
 return <svg className="postal-stamp" viewBox="0 0 400 348" aria-hidden="true">
 <defs>
 <path id={id+"pine"} d="m0 0-8 22 5-2-14 25 8-3-20 27 10-3-24 31 14-5-22 26 46-8 4 13 4-13 43 6-21-22 12 3-24-29 11 4-20-28 7 2-13-24 4 1Z"/>
 <g id={id+"tree"}><use href={"#"+id+"pine"} fill={green}/><path d="m-1 14-3 13 4-3m-4 12-7 11 11-6m-6 13-13 16 18-10m-10 17-17 17 23-11m-8 15-18 11 23-7m10-52 9 13-7-3m-1 18 12 14-10-4" fill={paper}/></g>
 <pattern id={id+"sky"} width="15" height="12" patternUnits="userSpaceOnUse"><path d="m2 4 4-.6m4 5 2-.4" stroke={paper} strokeWidth=".8" opacity=".28"/></pattern>
 <pattern id={id+"wood"} width="7" height="5" patternUnits="userSpaceOnUse"><path d="M0 4h5" stroke={paper} strokeWidth="1" opacity=".43"/></pattern>
 </defs>
 <rect x="6" y="6" width="388" height="336" fill={paper} stroke={paper} strokeWidth="10" strokeDasharray="4 5"/>
 <rect x="18" y="18" width="364" height="312" fill="none" stroke={red} strokeWidth="2"/>
 <path d="M26 65h348v201H26z" fill={green}/><path d="M26 65h348v201H26z" fill={'url(#'+id+'sky)'}/>
 <text x="28" y="49" fill={red} fontFamily="Georgia,serif" fontSize="21" fontWeight="bold" letterSpacing="1.6">POLAR POST</text><text x="369" y="49" fill={red} textAnchor="end" fontFamily="Georgia,serif" fontSize="22">25¢</text>
 <circle cx="281" cy="108" r="23" fill={paper}/>
 {Array.from({length:44},(_,i)=><circle key={i} className="fleck" style={{animationDelay:-(i%9)*.6+"s"}} cx={31+(i*67)%337} cy={70+(i*29)%119} r={i%4===0?1.6:.9} fill={paper}/>)}
 <path d="M26 187q35-13 54-34l20 7 33-29 25 20 33-33 47 38 29-14 44 22 34-16 29 13v103H26Z" fill={paper}/><path d="m134 135-20 26 14-9-5 10 12-15 7 5-4-9zm57-12-22 25 19-11-5 12 10-14 16 9Z" fill={green}/>
 <g transform="translate(54 115) scale(.92)"><use href={"#"+id+"tree"}/></g><g transform="translate(92 154) scale(.48)"><use href={"#"+id+"tree"}/></g>
 <g transform="translate(334 115) scale(.86)"><use href={"#"+id+"tree"}/></g><g transform="translate(300 156) scale(.55)"><use href={"#"+id+"tree"}/></g>
 <path d="M26 223q57-36 129-13t126 4q42-13 93-17v69H26Z" fill={paper}/>
 <g stroke={green} strokeWidth="2" strokeLinejoin="round">
 <path d="m150 171 44-32 72 8 27 31-78 1-21-22-37 30Z" fill={paper}/><path d="m157 181 37-28 22 25v47l-59-7Z" fill={red}/><path d="m216 178 68-2v42l-68 7Z" fill={red}/><path d="m216 178 68-2v42l-68 7Z" fill={'url(#'+id+'wood)'}/>
 <path d="m244 142-1-19 10-1 2 22" fill={red}/><path d="m240 122 15-1 1 4-15 1Z" fill={paper}/>
 <path d="M177 218v-24q7-8 13 0v25" fill={green}/><path d="m229 187 12-1v13l-12 1zm27-2 14-1v13l-14 1z" fill={paper}/><path d="M235 187v12m28-14v13m-34-4 12-1m15-1 14-1"/>
 <path d="m168 184 9-7 2 9-11 1Z" fill={paper}/></g>
 <path d="M249 115q-13-7 0-13t-5-12m9 23q-4-5 2-8" fill="none" stroke={paper} opacity=".65" strokeWidth="2"/>
 <path d="M183 220q-38 11-9 20t-11 23m27-42q-32 11-3 18t8 23" fill="none" stroke={red} strokeWidth="1.6" strokeDasharray="9 4"/>
 <g stroke={green} strokeWidth="1.3" opacity=".7">{Array.from({length:49},(_,i)=>{const x=30+(i*41)%330,y=226+(i*13)%33;return <path key={i} d={`M${x} ${y}l5 -1m2 0 2-.5`}/>})}</g>
 <path d="M26 65h348v201H26z" stroke={green} strokeWidth="2" fill="none"/>
 <text x="200" y="300" textAnchor="middle" fill={red} fontFamily="Georgia,serif" fontSize="30" letterSpacing="2.5">NORTH POLE</text>
 <text x="200" y="316" textAnchor="middle" fill={green} fontFamily="monospace" fontSize="8.7" letterSpacing="2.8">✦  CHRISTMAS MAIL  ✦</text>
 </svg>
}
