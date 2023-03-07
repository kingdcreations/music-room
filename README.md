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

#### Example:
#### Request only Public rooms
```
curl "https://music-room-81182-default-rtdb.europe-west1.firebasedatabase.app/rooms.json?orderByChild=private&equalTo=false&auth=<ACCESS_TOKEN>"
```
#### Request only user rooms (owner)
```
curl "https://music-room-81182-default-rtdb.europe-west1.firebasedatabase.app/rooms.json?orderByChild=owner/uid&equalTo=<UID>&auth=<ACCESS_TOKEN>"
```

### Write
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

#### Example:
```
curl -X POST -d '{"name": "<ROOM_NAME>", "owner": {"uid": "<UID>"}, "private": <BOOLEAN>}' "https://music-room-81182-default-rtdb.europe-west1.firebasedatabase.app/rooms.json?auth=<ACCESS_TOKEN>"
```

## Rooms/{$IDROOM}
### Read
This endpoint is used to read a specific room from the database. It requires a valid authentication token (auth.uid) to be present in the request header.

#### The following rules are applied:
The authenticated user must either exist in the users child node or be the owner of the room.

#### Firebase security rules:
```
data.child('users').child(auth.uid).val() === true || data.child('owner').child('uid').val() === auth.uid
```

#### Example:
```
curl "https://music-room-81182-default-rtdb.europe-west1.firebasedatabase.app/rooms/<IDROOM>.json?auth=<ACCESS_TOKEN>"
```

## Rooms/{$IDROOM}/users
### Write
This endpoint is used to add or remove users from a room in the database. It requires a valid authentication token (auth.uid) to be present in the request header.

#### The following rules are applied:
The authenticated user must be the owner of the room.

#### Firebase security rules:
```
auth.uid === data.parent().child('owner/uid').val()
```

#### Example:
```
curl -X PUT -d '{"<UID>": true, "<UID>": false, "<UID>": true, ... }' \
    "https://music-room-81182-default-rtdb.europe-west1.firebasedatabase.app/rooms/<IDROOM>/users.json?auth=<ACCESS_TOKEN>"
```


## Joins
This document has data of users for a specific room.

### Read
This endpoint is used to read childrens of /Joins. It requires a valid authentication token (auth.uid) to be present in the request header.

#### The following rules are applied:
This rule checks if the authenticated user is either the owner of the room or the user associated with the join. It allows the read operation if either of the following conditions is met:

The query orderByChild is "user/uid" and the equalTo value is equal to the authenticated user's UID.
The query orderByChild is "roomID" and the equalTo value is equal to the ID of a room where the authenticated user is the owner.

#### Firebase security rules:
```
auth.uid !== null &&
  (query.orderByChild === 'user/uid' && query.equalTo === auth.uid) ||
  (query.orderByChild === 'roomID' && root.child('rooms').child(query.equalTo).child('owner/uid').val() === auth.uid)
```

#### Example:
```
curl "https://music-room-81182-default-rtdb.europe-west1.firebasedatabase.app/joins.json?auth=<ACCESS_TOKEN>&orderByChild=<ORDER_BY_CHILD>&equalTo=<EQUAL_TO>"
```
Please replace <ORDER_BY_CHILD>, and <EQUAL_TO> with their actual values.

## Joins/{$joinID}
### Write
This endpoint is used to add a new child in join for a user in the database. It requires a valid authentication token (auth.uid) to be present in the request header.

#### The following rules are applied:
This rule checks if the authenticated user is the owner of the room where the child join is being added. It allows the write operation if the following conditions are met:

The new Data has a child named 'user' and 'roomID'
The authenticated user is not null.
The child join does not already exist in the database.
The authenticated user is the owner of the room associated with the join.

#### Firebase security rules:
```
auth.uid !== null && !data.exists() &&
  root.child('rooms').child(newData.child('roomID').val()).child('owner/uid').val() === auth.uid
newData.hasChildren(['user', 'roomID'])
```

#### Example:
```
curl -X POST -d '{"user": {"uid": "<UID>"}, "roomID": "<ROOM_ID>"}' \
  "https://music-room-81182-default-rtdb.europe-west1.firebasedatabase.app/joins.json?auth=<ACCESS_TOKEN>"
```

## Playlists/{$IDROOM}
### Read
This endpoint is used to read the playlists associated with a specific room from the database. It requires a valid authentication token (auth.uid) to be present in the request header.

#### The following rules are applied:
The room must exist in the database.
The authenticated user must either be the owner of the room, or:
The room is private and the authenticated user is added to the room's user list.
The room is public.

#### Firebase security rules:
```
root.child('rooms').child($roomID).exists() && (
  root.child('rooms').child($roomID).child('owner').child('uid').val() === auth.uid ||
  (root.child('rooms').child($roomID).child('private').val() === true &&
   root.child('rooms').child($roomID).child('users').child(auth.uid).val() === true) ||
  (root.child('rooms').child($roomID).child('private').val() === false)
)
```

#### Example:
```
curl "https://music-room-81182-default-rtdb.europe-west1.firebasedatabase.app/playlists/<IDROOM>.json?auth=<ACCESS_TOKEN>"
```

## Playlists/{$IDROOM}/queue/{$SONGID}
### Write
This endpoint is used to add a song to the queue of a specific room in the database. It requires a valid authentication token (auth.uid) to be present in the request header.

#### The following rules are applied:
The song can only be added to the queue if the authenticated user is authorized to access the room according to the following criteria:

The user is the owner of the room.
The room is private and the user is a member of the room.
The room is public.
The room is not private for edition and not private, which allows anyone to add songs to the queue.
The room is private for edition and the user is a member of the room.

#### Firebase security rules:
```
!data.exists() && root.child('rooms').child($roomID).exists() &&
    (root.child('rooms').child($roomID).child('owner').child('uid').val() === auth.uid ||
        (root.child('rooms').child($roomID).child('private').val() === true
            && root.child('rooms').child($roomID).child('users').child(auth.uid).val() === true) ||
        (root.child('rooms').child($roomID).child('private').val() === false
            && root.child('rooms').child($roomID).child('privateEdition').val() === false) ||
        (root.child('rooms').child($roomID).child('private').val() === false
            && root.child('rooms').child($roomID).child('privateEdition').val() === true
            && root.child('rooms').child($roomID).child('users').child(auth.uid).val() === true))
```
#### Example:
```
curl -X POST -d '{"author": "<AUTHOR>", "songID": "<SONG_ID>", "title": "<TITLE>", "thumbnailUrl": "<THUMBNAILURL>"}' "https://music-room-81182-default-rtdb.europe-west1.firebasedatabase.app/PLAYLISTS/<ROOM_ID>/queue/<SONG_ID>.json?auth=<ACCESS_TOKEN>"
```

