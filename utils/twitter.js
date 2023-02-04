import Twitter from "twitter";

let client = new Twitter({
  consumer_key: process.env.API_KEY_TWITTER,
  consumer_secret: process.env.API_SECRET_KEY_TWITTER,
  access_token_key: process.env.ACCESS_TOKEN_TWITTER,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET_TWITTER,
});

const DEFAULT_BIO = `Ingeniero de Sistemas | Noctámbulo a tiempo completo |  A veces hago proyectos personales| Opiniones personales |⏸ Nada por ahora`;

const MAX_CHARACTERS = 160;

export const updateBio = ({ playing, stringSong, error }) => {
  if (playing && !error) {
    const parsedBio = DEFAULT_BIO.split("|");
    parsedBio[parsedBio.length - 1] = ` ▶ ${stringSong}`;
    let newBio = constructBioString(parsedBio);

    newBio =
      newBio.length > MAX_CHARACTERS
        ? newBio.slice(0, newBio.indexOf("-")).trim()
        : newBio;

    client.post("account/update_profile", {
      description: newBio,
    });
  } else {
    client.post("account/update_profile", {
      description: DEFAULT_BIO,
    });
  }
};

const constructBioString = (parsedBio) => {
  let output_string = parsedBio.toString();
  output_string = output_string.replace(/,/g, "|");
  return output_string;
};
