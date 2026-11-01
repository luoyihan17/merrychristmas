# North Pole Calling

A mobile-first English Christmas voice gift. Address a friend, pick Santa or Pip the Elf, and edit the exact note they will hear. The three-step phone workshop and desktop editor share the same draft. Tap the rotary phone to dial the sample. Picking up starts playback; the signal meter follows playback state. Reduced-motion preferences disable decorative movement.

## Development

React, TypeScript, Vinext and Cloudflare Workers. Install dependencies, then run pnpm dev. Build with pnpm build. The Sites manifest binds an R2 bucket as BUCKET. Gift snapshots and generated MP3s survive changes to the device-local draft. A gift opens at /?gift=<id>; the built-in sample is /?gift=sample.

## Cloudflare Pages deployment

Use Node.js 22 or later and the pnpm version declared in package.json. Connect this repository to a Cloudflare Pages project, select the main branch, set the build command to `pnpm build:pages`, and set the output directory to `dist/pages`. The framework preset is None.

Before the first deployment, create an R2 bucket named `happy-christmas-gifts` in the same Cloudflare account. The tracked wrangler.jsonc binds it as `BUCKET`. The Pages build preserves the server-rendered gift pages and the gift and translation APIs. Static images, scripts, styles, and audio are served directly by Pages.

Set the optional Fish Audio variables described below as encrypted environment variables in Cloudflare. With no Fish Audio configuration, the app uses its existing device-voice mode. Keep runtime keys in Cloudflare settings.

## Audio configuration

Configure FISH_API_KEY, FISH_SANTA_VOICE_ID and FISH_ELF_VOICE_ID as server runtime variables. Use reference IDs you have auditioned in English. FISH_MODEL defaults to s2.1-pro-free; this release allows only that model. The server calls POST https://api.fish.audio/v1/tts and saves the MP3 response. Generation is explicit, idempotent per request, and limited to 15 real synthesis attempts per network per day.

Missing configuration enables a labeled device-voice demo. Device speech requires a supported browser and installed voice; a readable transcript is always available. Existing shared gifts retain their original messages. The built-in English sample is prerecorded with CMU Flite. See sample-note.txt for its provenance.

## Artwork and sharing

The cover and gift use an original two-colour SVG postage stamp. Portraits and postal decorations are original SVGs; interface icons are from Lucide. Message suggestions use local templates. System sharing falls back to clipboard and a selectable link. Anyone with the link can open the gift. No phone, contacts or microphone permissions are needed.

## Languages and translations

English is the initial interface language. The globe menu also offers Simplified Chinese, Japanese, Korean, Spanish and French and remembers the choice on this device. Gift text is separate from interface labels. The message editor and receiver transcript offer source and target language selectors with 33 options. A recipient can read a translation beside the original text. A creator can edit and apply a translation before explicitly generating a new recording. The snapshot records the chosen speech language; device voice availability depends on the listener's system.

The prepared sample includes six offline translations. For other text, tapping Translate sends that text to MyMemory through a same-origin endpoint. Only the read-only Get API is used. Free quota, network availability and individual language pairs affect service. Translations are not saved by the app unless the creator applies one to a draft and generates the gift.

Browsers exposing the on-device Translator API can use a local language pack; remote translation remains an explicit option. If the provider is unavailable, the error view links to Google Translate with the selected pair and text. A creator can paste the translation back, review it and apply it to the draft.

## Christmas postcard opening

The cover opens with a non-blocking printed-stamp entrance. Visitors can tap or pull the stamp to open their stationery. The three-step editor is shared across desktop and mobile. Gift URLs go straight to the recipient. Reduced-motion preferences disable the animated entrance, snowfall, and ringing.

The cover and workshop play “December at the Post Office”, an original instrumental loop with piano, bells and light sleigh percussion. The bundled legacy track “Deck the Halls A” by Kevin MacLeod (Incompetech), ISRC USUAN1100263, is credited at https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100263 and licensed under https://creativecommons.org/licenses/by/4.0/ . Music is enabled by default on the cover and in the workshop. If autoplay is blocked, the next ordinary gesture starts playback. The mute preference is stored on this device; the soundtrack pauses on gift pages and while the tab is hidden.
