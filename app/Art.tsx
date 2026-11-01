import {TreePine,Star} from "lucide-react";
export function Portrait({elf=false}:{elf?:boolean}){
 return <span aria-hidden="true" className={"portrait painted-portrait"+(elf?" pip":"")}/>;
}
export function Stamp(){return <div className="stamp" aria-hidden="true"><span>POLAR POST</span><TreePine size={28}/><small>25 ❄</small></div>}
export function Brand(){return <div className="brand"><span className="brandmark"><TreePine size={27} strokeWidth={1.8}/><Star size={8} fill="currentColor"/></span><span><b>Polar Exchange</b><small>NORTH POLE • EST. 1225</small></span></div>}
