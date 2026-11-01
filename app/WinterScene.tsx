"use client";
import {useId} from "react";
import type {CSSProperties} from "react";

// A two-ink postcard scene. Separate layers keep the windows, smoke and snowfall movable.
function Fir({x,y,s,ink}:{x:number;y:number;s:number;ink:string}){
 return <g transform={`translate(${x} ${y}) scale(${s})`}>
  <path fill={ink} d="M0-109 -9-83 -6-84 -19-63 -14-65 -28-43 -21-46 -39-19 -27-22 -46 2 -4-4 -3 10 4 10 4-4 40 1 28-15 34-13 18-38 24-35 11-60 16-57 4-88 7-85Z"/>
  <g fill="#a8beae"><path d="m0-103-8 23 7-6 4 3zM-7-73l-10 15 13-7 6 2-5-5zM-13-53l-13 15 16-7 7 2-7-6zM-19-32l-16 17 21-9 8 1-10-5z"/><path opacity=".65" d="m3-77 9 16-8-6zm5 28 13 15-12-7zm7 27 15 11-11-3z"/></g>
 </g>
}
function Lights(){return <g><path d="M3 16Q102 70 183 29T367 26Q466 65 574 6" fill="none" stroke="#152e31" strokeWidth="2.4"/>
 {[[25,26],[54,36],[84,42],[115,44],[146,40],[177,32],[206,21],[236,12],[267,8],[299,10],[329,16],[359,24],[389,32],[420,38],[451,39],[482,34],[513,26],[544,15]].map(([x,y],i)=><g transform={`translate(${x} ${y}) rotate(${i%2?9:-8})`} key={x}><path d="M0 0v5" stroke="#132f32" strokeWidth="2.5"/><ellipse cy="8" rx="2.1" ry="3.4" fill={["#ffc674","#de7662","#f3dfaa"][i%3]}/></g>)}</g>}
export function WinterPrint({viewBox="0 0 576 360",width,height}:{viewBox?:string;width?:number;height?:number}){
 const id=useId().replace(/:/g,"");
 return <svg className="woodcut" width={width} height={height} viewBox={viewBox} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
 <defs>
 <pattern id={id+"snow"} patternUnits="userSpaceOnUse" width="37" height="25"><path d="m2 8 7-1m11 10 5-1m4-13 3-1" stroke="#7e9f9a" strokeWidth=".85" opacity=".54"/></pattern>
 <pattern id={id+"ink"} patternUnits="userSpaceOnUse" width="11" height="9"><path d="m2 1 1 2m5 4 1-1" stroke="#e6d3ac" strokeWidth=".6" opacity=".26"/></pattern>
 <pattern id={id+"siding"} patternUnits="userSpaceOnUse" width="60" height="10"><path d="M0 7q23-2 60 0m-47-4 8-1" stroke="#9b633f" opacity=".63" strokeWidth="1.5"/></pattern>
 </defs>
 <rect width="576" height="360" fill="#21464d"/><rect width="576" height="255" fill={'url(#'+id+'ink)'}/>
 <circle cx="412" cy="66" r="24" fill="#f4dead"/><path d="M404 46q20 3 22 21-6-10-13-11z" fill="#e4c78e" opacity=".55"/>
 {[[38,69],[86,37],[132,85],[190,50],[211,18],[266,70],[313,35],[359,89],[463,36],[525,66],[548,27],[222,103],[106,118]].map(([x,y],i)=><path key={x} transform={`translate(${x} ${y}) scale(${i%3===0?.85:.44})`} d="m0-5 1 4 4 1-4 1-1 5-1-5-4-1 4-1Z" fill="#f4d9a0"/>)}
 <path d="M-15 204 40 165 65 175 108 136 142 162 177 139 207 155 253 119 283 139 315 120 363 154 397 135 437 159 477 129 520 152 574 118 603 148 608 239H0Z" fill="#719492"/>
 <path d="m58 184 51-48 29 25-27-12-11 5 5-8zm163-31 32-34 26 17-28-8-5 8z" fill="#c8d3be"/>
 <path d="M0 199q105-59 181-22t160-1q112-50 235-10v100H0Z" fill="#497070"/>
 {[[6,211,.64],[45,207,.8],[82,209,.57],[118,205,.7],[155,208,.45],[190,202,.5],[386,218,.51],[427,210,.6],[475,208,.86],[513,208,.68],[556,210,.92]].map(([x,y,s])=><Fir key={x} x={x} y={y} s={s} ink="#315a57"/>)}
 <path d="M0 209q60-16 110 3t102 3q71-27 150-11t115 4q50-15 99-8v160H0Z" fill="#e5e5cb"/>
 <path d="M0 233q108-34 215 6t201-11q81-30 160-9v34q-79-16-156 8t-187-1Q108 222 0 256Z" fill="#b8cbc0"/>
 <path d="M0 230q69-19 126-7m313 18q70-26 125-17" fill="none" stroke="#eff0d8" strokeWidth="3"/>
 <Fir x={94} y={237} s={1.26} ink="#264f48"/><Fir x={152} y={227} s={.81} ink="#365e53"/><Fir x={458} y={236} s={1.16} ink="#294f49"/>
 <path d="M290 236q88 3 77 21c-10 16-91 17-90 27 0 7 97 8 117 28q18 21-13 48h-89q48-29 20-43c-21-11-102-15-96-38 7-23 99-22 87-35Z" fill="#b7c8b9"/>
 <path d="M228 275c27-14 88-15 88-27m-59 53q86 11 89 22" stroke="#eae6cb" fill="none" strokeDasharray="10 5 2 5" strokeWidth="2"/>
 <g className="cabin-smoke" fill="none" stroke="#d8ddc7" strokeWidth="3" strokeLinecap="round" opacity=".6"><path d="M343 130q-12-12 1-21t-2-21"/><path d="M347 104q10-7 4-14" opacity=".58"/></g>
 <g strokeLinejoin="round" strokeLinecap="round">
 <path d="m201 241 95 8 112-15-92-11z" fill="#819e91"/>
 <path d="m220 174 55-43 42 45-1 66-96-4z" fill="#bb7648" stroke="#453e32" strokeWidth="2"/>
 <path d="m315 177 78-9-2 63-75 11z" fill="#866445" stroke="#453e32" strokeWidth="2"/>
 <path d="m220 174 55-43 42 45-1 66-96-4z" fill={'url(#'+id+'siding)'}/>
 <path d="m270 130 80-9 52 45-87 15z" fill="#a94738" stroke="#513c31" strokeWidth="2"/>
 <path d="m337 127-1-25 11-1 1 24" fill="#a54e38" stroke="#5e4333" strokeWidth="2"/>
 <path d="m332 101 18-2 1 6-18 1z" fill="#f2e8cb"/>
 <path d="m269 128 61-8 6 4 15-4 51 46-16 1-9-7-9 1-19-15-15 1-13-7-24 1z" fill="#f2e6c9"/>
 <path d="m204 180 63-60 13-1 47 56-10 7-43-45-60 51z" fill="#a44231" stroke="#543e31" strokeWidth="2"/>
 <path d="m202 177 65-60 13 1 44 53-10-2-36-37-4-3-60 54-10 1z" fill="#f8ebd2"/>
 <path d="m234 196 25 1v29l-25-1z" fill="#f1bc63" className="lit-window pane-a" stroke="#504432" strokeWidth="3"/>
 <path d="m234 210 25 1m-13-15v30" stroke="#62533b" strokeWidth="2"/>
 <path d="m329 190 17-2v26l-17 2z" fill="#f1bc63" className="lit-window pane-b" stroke="#4d4331" strokeWidth="2.5"/>
 <path d="m329 203 17-2m-9-12v26" stroke="#61513a" strokeWidth="2"/>
 <path d="m358 185 18-2v27l-18 2z" fill="#f1bc63" className="lit-window pane-c" stroke="#4d4331" strokeWidth="2.5"/>
 <path d="m358 198 18-2m-9-13v27" stroke="#61513a" strokeWidth="2"/>
 <path d="m268 241 2-46 27 1-1 46z" fill="#35594b" stroke="#4d4031" strokeWidth="3"/>
 <circle cx="283" cy="207" r="7" fill="none" stroke="#71864e" strokeWidth="4"/><path d="m281 212 3-3 4 3" stroke="#cb5b43" strokeWidth="3"/>
 <rect x="272" y="219.8" width="22" height="3.7" rx=".8" fill="#493b2b" stroke="#e2bd77" strokeWidth="1"/>
 <circle cx="290" cy="228" r="1.8" fill="#eed593"/>
 <path d="m264 241 37 1 4 4-44 1z" fill="#f7edd6"/>
 <path d="m233 177 68 2-1 12-69-1z" fill="#f0d6a1" stroke="#785339" strokeWidth="1.3"/>
 <text x="266" y="187" textAnchor="middle" fontFamily="Georgia,serif" letterSpacing="1" fontSize="7.3" fill="#453f31" stroke="none">POST OFFICE</text>
 <path d="m212 184 59-51 40 44" fill="none" stroke="#274c3d" strokeWidth="2"/>
 {[[222,176],[233,166],[244,156],[255,147],[266,137],[280,144],[289,155],[299,167]].map(([x,y],i)=><circle key={x} cx={x} cy={y+2} r="2.3" fill={i%3?"#ffdb8b":"#df7958"}/>)}
 </g>
 <g fill="none" stroke="#735e46" strokeWidth="3"><path d="m153 232 52 6m-54 0 53 6m-47-17-1 18m15-16-1 18m16-16-1 18m15-15-1 18"/></g>
 <g transform="translate(400 240) rotate(-3)"><path d="m0-9 1 26" stroke="#806749" strokeWidth="5"/><path d="M-11-6v-16q0-7 8-7h12l5 5v18z" fill="#a74435" stroke="#624335" strokeWidth="2"/><path d="M-12-22q0-10 9-10H9l6 6-17-1-4 5z" fill="#f5e9cf"/><path d="m-7-17 13 1" stroke="#4a4131" strokeWidth="3"/></g>
 <g transform="translate(162 261) rotate(-5)">
 <ellipse cx="2" cy="5" rx="24" ry="4" fill="#b2c4b6"/>
 <path d="m-11-16-14-12-5-1m5 1-1-6m37 17 15-11 5-1m-7 2 2-7" fill="none" stroke="#6b5542" strokeWidth="2" strokeLinecap="round"/>
 <ellipse cy="-9" rx="15" ry="16" fill="#f9efd9" stroke="#b7c7ba" strokeWidth="1.5"/><circle cy="-30" r="10" fill="#f7edd9" stroke="#bfccbe" strokeWidth="1.3"/>
 <path d="m-10-23q9 5 18 0l1 4q-11 4-20-1zm13 5 5-1 3 14-5 1z" fill="#ac4133"/>
 <path d="m-9-37q2-13 10-12 6 0 8 7l-3 6z" fill="#a24739"/><path d="m-10-38 18-2 1 4-18 2z" fill="#e4c9a1"/><circle cx="8" cy="-44" r="2.6" fill="#f8e7c5"/>
 <circle cx="2" cy="-31" r="1" fill="#4f4639"/><path d="m6-30 10 2-10 1z" fill="#cb8650"/><path d="m3-1 1-2m-2-5v-2" stroke="#6c6251" strokeWidth="2.7"/>
 </g>
 <g transform="translate(235 234) rotate(2)"><path d="M-4-3h18v13H-4z" fill="#a44836"/><path d="M3-3h3v13H3z" fill="#e2bd73"/><path d="M14 0h12v10H14z" fill="#b59c66"/><path d="M19 0h3v10h-3z" fill="#43684c"/><path d="M4-4q-10-8-8-3 3 4 8 3 6-9 7-5 1 3-7 5z" fill="none" stroke="#cda76a" strokeWidth="2"/></g>
 <path d="M0 295q52-16 104-4m308-15q84-15 162-4M49 337q81-19 151-6m236 10q63-17 101-15" fill="none" stroke="#a4bcb0" strokeWidth="2"/>
 <path d="M0 263q88-10 156 8l-22 89H0zm427 14q73-32 149-22v105H403z" fill={'url(#'+id+'snow)'}/>
 <Fir x={10} y={294} s={1.98} ink="#183f39"/><Fir x={559} y={284} s={1.86} ink="#1d453d"/><Fir x={507} y={289} s={1.04} ink="#325a4e"/>
 <Lights/>
 </svg>;
}
export function WinterScene({className=""}:{className?:string}){
 return <div className={"winter-scene "+className} aria-hidden="true"><WinterPrint/><div className="post-snow">{Array.from({length:35},(_,i)=><i key={i} style={{"--x":((i*37)%100)+"%","--size":(1.6+i%4)+"px","--speed":(3.3+(i%7)*.61)+"s","--delay":(-i*.79)+"s","--drift":(9+(i%6)*5)+"px"} as CSSProperties}/>)}</div></div>
}
