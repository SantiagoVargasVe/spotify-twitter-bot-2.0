import SpotifyWebApi from "spotify-web-api-node";
import * as dotenv from "dotenv";
dotenv.config();
// hide this

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIEND_ID_SPOTIFY,
  clientSecret: process.env.CLIENT_SECRET_SPOTIFY,
  redirectUri: "https://www.google.com",
});
//TODO: Hide this aswell xd

const code =
  "AQBv-UTo6uUCQsBCn1exwnMlhOmVaTD1oAQY9V-E5FgfBLCPO8UwTiNMtPplYRKrnkWqxwIcfMYDMqEH-HX3N5FYkifQOhP6F-nEAQTScxr9-tJml2AdkxTgnRcpp_AKLwz0SR2iIQ86Ur18M9tKe29pF9uqK2HjfXE-tGD74j1Xzj6uWB0dI0m1plLwI_92uMaNEsJ0w90JveMtP-w";

const state = "viewed";
const scopes = [
  "user-read-private",
  "user-read-email",
  "user-read-currently-playing",
  "user-read-playback-state",
];

const CODE =
  "AQBgx7htwL3U86V3NW3jOViumm4CqtWxNjkcwLOXPgdnvlHzt3_iegtSqbD2nni39lZ9s8uV6atVNgNg4mrL-7HH2A8Y3ZMk-UutHaVy_F68N7tBfNCdvKhvXQDunMu1MD1XSYzTZBC1LExMHl1clD4XjvfZbMgeFPNbFwyviJnaHuhsR9xlWFyLvsc2gN4YeorfXw9QtiHJ_Gt6yivlttF80sHKg6K0AByYfGkd0b69tjH3RH_e9WcidFULdR5bUraDgek64WICmJs3vY2aRxuM3zX1";

let ACCESS_TOKEN =
  "BQDHUj6m5Lt9VoICbde76mnwbYvPDSWgQLrDufqNdiOx6fT1DfiyIu58-ervAZ5COz-I_A5PgDmh6zftGc47JxBA5cFNLdza3HDaDNesfLPY_-2x7qlVgyNKLskYb3-g7s8WjxcdiKLVvex6-t5G9DGY0NQ1prevO-dACsPunmWfGIWmAL5NYhd3iPxd43XOtvRduZApoBHLXav_zZg8Pqb_QHZy";

let REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const setTokens = async () => {
  spotifyApi.setAccessToken(ACCESS_TOKEN);
  spotifyApi.setRefreshToken(REFRESH_TOKEN);
};
// getAccessAndRefrestToken();

const getTokens = async () => {
  const data = await spotifyApi.authorizationCodeGrant(CODE);
  console.log("The token expires in: " + data.body["expires_in"]);
  console.log("The access token is: " + data.body["access_token"]);
  console.log("The refresh token is: " + data.body["refresh_token"]);
};

setTokens();

export const createURL = () => {
  return spotifyApi.createAuthorizeURL(scopes, state);
};

const refreshTokens = async () => {
  const data = await spotifyApi.refreshAccessToken();
  ACCESS_TOKEN = data.body.access_token;
  spotifyApi.setAccessToken(data.body.access_token);
};
// console.log(createURL());

export const seeCurrentTrack = async () => {
  const response = {
    playing: false,
    progress: 0,
    duration: 0,
    error: false,
    stringSong: undefined,
  };

  try {
    const result = await spotifyApi.getMyCurrentPlaybackState();
    if (result.statusCode == 204) {
    } else {
      console.log(
        result.body.item.name + " - " + result.body.item.artists[0].name
      );

      response.progress = result.body.progress_ms;
      response.duration = result.body.item.duration_ms;
      response.stringSong =
        result.body.item.name + " - " + result.body.item.artists[0].name;
      response.playing = true;
    }
  } catch (error) {
    console.log("Hay error");
    if (error.body.error.status === 401) {
      refreshTokens();
    }
    response.error = true;
  }

  return response;
};
