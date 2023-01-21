import express from 'express'
import http from 'http'

import fs from 'fs'
import path from 'path'
import ytdl from 'ytdl-core'

import admin from "firebase-admin"

import Room from './classes/Room'

admin.initializeApp({
  credential: admin.credential.cert("../serviceAccountKey.json"),
  databaseURL: "https://music-room-81182-default-rtdb.europe-west1.firebasedatabase.app"
});

const rooms = new Map()

const db = admin.database().ref('/rooms/')
db.on('child_added', function(dataSnapshot) { 
  rooms.set(dataSnapshot.key, new Room(dataSnapshot))
})

db.on('child_removed', function(dataSnapshot) { 
  rooms.delete(dataSnapshot.key)
})

const downloadsDir = path.resolve(__dirname, `downloads`);
if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir);

const app = express()
app.get("/song/:id", (req, res) => {
  res.set({
    'Content-Type': 'audio/mpeg',
  });

  const output = path.resolve(__dirname, `downloads/${req.params.id}.mp3`);
  fs.access(output, fs.constants.F_OK, (err) => {
    if (err) { // File not downloaded yet
      console.log(`Downloading from id ${req.params.id}`);

      const stream = ytdl(encodeURI(`https://www.youtube.com/watch?v=${req.params.id}`), {
        filter: 'audioonly',
      }).pipe(fs.createWriteStream(output))

      stream.on('finish', () => {
        res.sendFile(output)
      })
    } else { // Serve file
      res.sendFile(output)
    }
  })
})

app.get("/room/:key", (req, res) => {
  res.json(rooms.get(req.params.key))
})

const server = http.createServer(app)
server.listen(3000)