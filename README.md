# Music Room

Music, Collaboration and mobility

# API Documentation

## Introduction

This API allows developers to query data from their room and playlists using HTTP requests. Firebase and Firebase Authentication are used for authentication and database management.

## Authentification

All requests require a valid Firebase Authentication token to be included in the request headers.

To obtain an authentication token, developers must use the Firebase Authentication API to authenticate a user. Once authenticated, the API will return an access token that can be used to make requests to this API.
https://firebase.google.com/docs/firestore/use-rest-api?hl=fr

# Endpoints
/room/{roomId}
This endpoint allows developers to retrieve data from their room.

GET /room/{roomId}
Returns information about the room.

/playlists
This endpoint allows developers to retrieve playlists.

GET /playlists
Returns a list of playlists.

/playlists/{playlistId}
This endpoint allows developers to retrieve data from a specific playlist, with sorting based on votes.

GET /playlists/{playlistId}?sortBy=votes&sortOrder=asc
Returns information about the specified playlist, sorted by votes in ascending order.




/////////////////

RTDB

ROOMS
-> READ: 
"auth.uid !== null && ((query.orderByChild === 'private' && query.equalTo === false) ||
                (query.orderByChild ===   'owner/uid' && query.equalTo === auth.uid))"
-> WRITE: Follow ROOMS/{$IDROOM} to write inside. ( Tips: use this to auto generate IDROOM, POST REQUEST)

ROOMS/{$IDROOM}
-> READ:
data.child('users').child(auth.uid).val() === true || data.child('owner').child('uid').val() === auth.uid
-> WRITE: 
auth.uid !== null && !data.exists()
WHEN DATA = newData.hasChildren(['name', 'owner', 'private'])
WHEN OWNER = newData.hasChild('uid')
WHEN UID = newData.isString() && newData.val() === auth.uid

ROOMS/{$IDROOM}/users
-> WRITE:
auth.uid === data.parent().child('owner/uid').val()

-----------------------

JOINS
--> READ:
auth.uid !== null &&
        	(query.orderByChild === 'user/uid' && query.equalTo === auth.uid) ||
        	(query.orderByChild === 'roomID' && root.child('rooms').child(query.equalTo).child('owner/uid').val() === auth.uid)"
--> WRITE:
auth.uid !== null && !data.exists() &&
          	root.child('rooms').child(newData.child('roomID').val()).child('owner/uid').val() === auth.uid
WHEN DATA = newData.hasChildren(['user', 'roomID'])

-------------------------

PLAYLISTS/{$IDROOM}
--> READ:
root.child('rooms').child($roomID).exists() &&
          (root.child('rooms').child($roomID).child('owner').child('uid').val() === auth.uid ||
          	(root.child('rooms').child($roomID).child('private').val() === true
            	&& root.child('rooms').child($roomID).child('users').child(auth.uid).val() === true) ||
          	(root.child('rooms').child($roomID).child('private').val() === false))

PLAYLISTS/{$IDROOM}/queue/{$SONGID}
--> WRITE:
!data.exists() && root.child('rooms').child($roomID).exists() &&
            	(root.child('rooms').child($roomID).child('owner').child('uid').val() === auth.uid ||
          			(root.child('rooms').child($roomID).child('private').val() === true
             			&& root.child('rooms').child($roomID).child('users').child(auth.uid).val() === true) ||
            		(root.child('rooms').child($roomID).child('private').val() === false
             			&& root.child('rooms').child($roomID).child('privateEdition').val() === false) ||
            		(root.child('rooms').child($roomID).child('private').val() === false
             			&& root.child('rooms').child($roomID).child('privateEdition').val() === true
             			&& root.child('rooms').child($roomID).child('users').child(auth.uid).val() === true))

PLAYLISTS/{$IDROOM}/queue/{$SONGID}/votes
--> WRITE:
root.child('rooms').child($roomID).child('owner').child('uid').val() === auth.uid ||
                	(root.child('rooms').child($roomID).child('private').val() === true
                  	&& root.child('rooms').child($roomID).child('users').child(auth.uid).val() === true) ||
                  (root.child('rooms').child($roomID).child('private').val() === false
                  	&& root.child('rooms').child($roomID).child('privateVoting').val() === false) ||
                  (root.child('rooms').child($roomID).child('private').val() === false
                    && root.child('rooms').child($roomID).child('privateVoting').val() === true
                    && root.child('rooms').child($roomID).child('users').child(auth.uid).val() === true)



curl -X PUT -d '{"COUCOU":"MDR"}' 'https://music-room-81182-default-rtdb.europe-west1.firebasedatabase.app/playlists/-NPX5J6veGnPMlyN7Fub.json?auth=eyJhbGciOiJSUzI1NiIsImtpZCI6ImY4NzZiNzIxNDAwYmZhZmEyOWQ0MTFmZTYwODE2YmRhZWMyM2IzODIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiVGVzdCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BRWRGVHA2ZFl1NG8xLVNyT05hOWNMNUZfa2Nsek9FaXJJQ1YwS1B4SUhMRD1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9tdXNpYy1yb29tLTgxMTgyIiwiYXVkIjoibXVzaWMtcm9vbS04MTE4MiIsImF1dGhfdGltZSI6MTY3NzE2NTg3MSwidXNlcl9pZCI6IlhxZTNHUjZrb0lhWnMxTTMybGRoRnUxeDdtTzIiLCJzdWIiOiJYcWUzR1I2a29JYVpzMU0zMmxkaEZ1MXg3bU8yIiwiaWF0IjoxNjc3NzcwMDczLCJleHAiOjE2Nzc3NzM2NzMsImVtYWlsIjoibGFpZ25lbGV0aGFuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTE4Mjk2MTg5ODIyNDMxNzY3NjgwIl0sImVtYWlsIjpbImxhaWduZWxldGhhbkBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.VApxYOd_Kr8ckGldwDhieQZRvuXM7_L9LlRP319I789RkSvvDHo8I_sAZM3cYn-aITRTs3cLdthgSeKbkfIr5Pl35PY1dDtkaXyGGxb9lC8IvfxV08ScvSZbZMtRimlwfjiXrnP3pFHNRJUFvDdBDM7cYnlPkyDiDMC_9TCI-wH2xXCoIhNGE044BPNSS_jlNG9JUqQaEj3D0O7ZKWTs_pVQ4nKvJgdP6QjJiJXPlhyFLCMoZruTQcYySAt16kxubCkHdVrhvQgva9QgSnGYhLUHwTQmmyNVEIJCAAPmrtAeUvRX4Og3E8QwUaV8UPnobqdsfUl9G_aWY2KPQYiNYg'

