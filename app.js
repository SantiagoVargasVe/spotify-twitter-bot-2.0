import * as spotify from "./utils/spotify.js";
import * as twitter from "./utils/twitter.js";
let timeOut = 3_000;

const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

const entryPoint = async () => {
  try {
    const { playing, progress, duration, error, stringSong } =
      await spotify.seeCurrentTrack();
    twitter.updateBio({ playing, error, stringSong });
    timeOut = !error && playing ? duration - progress : 3_000;

    console.log("timeout:" + timeOut);
    console.log(millisToMinutesAndSeconds(timeOut));
    setTimeout(entryPoint, timeOut);
  } catch (error) {
    console.log(error);
    setTimeout(entryPoint, timeOut);
  }
};

entryPoint();
