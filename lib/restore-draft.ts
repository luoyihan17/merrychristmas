import {wishText,type Draft} from "./gift";

// Migrate only shipped suggestions. Free-form notes and sealed gifts are personal.
const oldSuggestions = new Map([
  ["愿你忙的时候有人等，闲的时候，我们能常常见面。",wishText[0]],
  ["愿新的一年，你期待的好消息，都能一个一个到来。",wishText[1]],
  ["愿你在这个冬天睡几个好觉，也给自己放个小假。",wishText[2]],
  ["愿这份快乐也回到你身边，我们很快再见。","Sending that Christmas cheer right back to you."],
  ["一起赶过末班地铁","Our last-train sprint"],
  ["抢了五次演唱会门票","Five tries for concert tickets"],
  ["总是接住我的碎碎念","Our midnight voice notes"]
]);
export function restoreDraft(draft: Draft): Draft {
  return {...draft, wish:oldSuggestions.get(draft.wish)??draft.wish, detail:oldSuggestions.get(draft.detail)??draft.detail};
}
