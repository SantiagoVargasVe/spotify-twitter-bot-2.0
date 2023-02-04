import * as spotify from "./utils/spotify.js";
import * as twitter from "./utils/twitter.js";
let timeOut = 3_000;

const entryPoint = () => {
  setTimeout(async () => {
    const { playing, progress, duration, error, stringSong } =
      await spotify.seeCurrentTrack();
    twitter.updateBio({ playing, error, stringSong });
    entryPoint();
    timeOut = !error && playing ? duration - progress : 3_000;

    console.log("timeout:" + timeOut);
    console.log("till next song:" + Math.floor((timeOut / 1000) % 60));
  }, timeOut);
};

entryPoint();
