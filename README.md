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



## Rooms
### Read
This endpoint is used to read rooms from the database. It requires a valid authentication token (auth.uid) to be present in the request header.

The query.orderByChild parameter is used to sort the results by a specific child node. The query.equalTo parameter is used to filter the results by a specific value.

#### The following rules are applied:
The private child node must be set to false.
The owner/uid child node must be set to the authenticated user's uid.

#### Firebase security rules:
```
auth.uid !== null && ((query.orderByChild === 'private' && query.equalTo === false) ||
(query.orderByChild === 'owner/uid' && query.equalTo === auth.uid))
```

#### Curl requests:
#### Request only Public rooms
```
curl "https://music-room-81182-default-rtdb.europe-west1.firebasedatabase.app/rooms.json?orderByChild=private&equalTo=false&auth=<ACCESS_TOKEN>"
```
#### Request only user rooms (owner)
```
curl "https://music-room-81182-default-rtdb.europe-west1.firebasedatabase.app/rooms.json?orderByChild=owner/uid&equalTo=<UID>&auth=<ACCESS_TOKEN>"
```

### WRITE
This endpoint is used to create a new room in the database. It requires a valid authentication token (auth.uid) to be present in the request header. 

#### The following rules are applied:
The authenticated user must exist (auth.uid !== null).
The room must not already exist (!data.exists()).
The new data must have the name, owner, and private child nodes.
The owner/uid child node must be set to the authenticated user's uid.


##### Additional Info:
Using this endpoints will automaticaly generate the IDROOM.

#### Firebase security rules:
```
auth.uid !== null && !data.exists()
newData.hasChildren(['name', 'owner', 'private'])
  newData.hasChild('uid')
    newData.isString() && newData.val() === auth.uid
```

#### Curl requests:
```
curl -X POST -d '{"name": "<ROOM_NAME>", "owner": {"uid": "<UID>"}, "private": <BOOLEAN>}' "https://music-room-81182-default-rtdb.europe-west1.firebasedatabase.app/rooms.json?auth=<ACCESS_TOKEN>"
```







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

