import express from 'express'
import http from 'http'

import fs from 'fs'
import path from 'path'
import admin from "firebase-admin"

import Room from './classes/Room'

admin.initializeApp({
  credential: admin.credential.cert("../serviceAccountKey.json"),
  databaseURL: "https://music-room-81182-default-rtdb.europe-west1.firebasedatabase.app"
});

const rooms = new Map<string, Room>()

const db = admin.database().ref('/rooms/')
db.on('child_added', (dataSnapshot) => { 
  if (dataSnapshot.key) rooms.set(dataSnapshot.key, new Room(dataSnapshot))
})

db.on('child_removed', (dataSnapshot) => { 
  if (dataSnapshot.key) rooms.delete(dataSnapshot.key)
})

const downloadsDir = path.resolve(__dirname, `downloads`);
if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir);

const app = express()
app.get("/song/:id", (req, res) => {
  res.set({
    'Content-Type': 'audio/mpeg',
  });

  const output = path.resolve(__dirname, `downloads/${req.params.id}.mp3`);
  res.sendFile(output)
})

app.get("/room/:key", (req, res) => {
  res.json(rooms.get(req.params.key)?.getCurrentSongStream())
})

const server = http.createServer(app)
server.listen(3000)