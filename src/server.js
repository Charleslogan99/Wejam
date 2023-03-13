require('dotenv').config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const lyricsFinder = require("lyrics-finder");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        // redirectUri: process.env.REDIRECT_URI,
        // clientId: process.env.CLIENT_ID,_URI,
        // clientSecret: process.env.CLIENT_SECRET,
        redirectUri: "http://localhost:3000",
   clientId: "ebc0d5a8595449f495e38c5c494fe380",
   clientSecret: "fb73684c3b7e4f48b0ba0556a5cc2ae7",
        refreshToken,
    })
    spotifyApi
    .refreshAccessToken()
    .then((data) => {
          res.json({
            accessToken: data.body.access_token,
            expiresIn: data.body.expires_in 
          })  
      
          // Save the access token so that it's used in future calls
          spotifyApi.setAccessToken(data.body['access_token']);
        }).catch((err) => {
            console.log(err)
            res.sendStatus(400);
        })

    })

app.post('/login', (req, res) => {
    const code = req.body.code;
const spotifyApi = new SpotifyWebApi({
   redirectUri: "http://localhost:3000",
   clientId: "ebc0d5a8595449f495e38c5c494fe380",
   clientSecret: "fb73684c3b7e4f48b0ba0556a5cc2ae7"
    // redirectUri: process.env.REDIRECT_URI,
    // clientId: process.env.CLIENT_ID,
    // clientSecret: process.env.CLIENT_SECRET,
})
spotifyApi
.authorizationCodeGrant(code)
.then(data => {
    res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
    })
}).catch((err)  => {
    res.sendStatus(400);
});
})

app.get('/lyrics', async (req, res) => {
const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No Lyrics Found"
res.json({ lyrics })
})

app.listen(3001)