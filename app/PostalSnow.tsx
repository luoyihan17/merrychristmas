import type {CSSProperties} from "react";
import {Snowflake} from "lucide-react";

export function PostalSnow() {
  return <div className="postal-snow" aria-hidden="true">
    {Array.from({length: 28}, (_, i) => {
      const size = 3 + i * 7 % 10;
      const style = {
        left: `${(i * 37 + 3) % 100}%`,
        width: size,
        height: size,
        "--drift": `${(i % 2 ? 1 : -1) * (18 + i % 35)}px`,
        animationDuration: `${10 + i * 3 % 11}s`,
        animationDelay: `-${((i * .618) % 1) * (10 + i * 3 % 11)}s`,
      } as CSSProperties;
      return <span key={i} style={style}>{size >= 9 && <Snowflake size={size} strokeWidth={1.6}/>}</span>;
    })}
  </div>;
}
