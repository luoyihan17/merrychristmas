import type { Metadata } from "next";
import "./globals.css";
import "./press.css";
import "./storybook.css";
import {LanguageProvider} from "./Locale";
export const metadata:Metadata={title:"North Pole Calling",description:"Make a personal Christmas voice call from Santa or Pip the Elf.",icons:{icon:"/favicon.svg"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><LanguageProvider>{children}</LanguageProvider></body></html>}
