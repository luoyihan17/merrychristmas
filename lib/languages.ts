export const languages: Record<string,string> = {
 en:"English","zh-CN":"简体中文","zh-TW":"繁體中文",ja:"日本語",ko:"한국어",es:"Español",fr:"Français",de:"Deutsch",it:"Italiano",pt:"Português",nl:"Nederlands",sv:"Svenska",da:"Dansk",no:"Norsk",fi:"Suomi",pl:"Polski",cs:"Čeština",el:"Ελληνικά",ro:"Română",uk:"Українська",ru:"Русский",tr:"Türkçe",ar:"العربية",he:"עברית",hi:"हिन्दी",bn:"বাংলা",ur:"اردو",vi:"Tiếng Việt",th:"ไทย",id:"Bahasa Indonesia",ms:"Bahasa Melayu",tl:"Filipino",sw:"Kiswahili"
};
export const uiLanguages=["en","zh-CN","ja","ko","es","fr"];
export function guessLanguage(text:string) {
 if(/[ぁ-ヿ]/.test(text))return "ja";
 if(/[가-힣]/.test(text))return "ko";
 if(/[\u4e00-\u9fff]/.test(text))return "zh-CN";
 if(/[\u0600-\u06ff]/.test(text))return "ar";
 return "en";
}
