export type Track = {
    id: string,
    title: string,
    author: string,
    thumbnailUrl: string
}

export type Room = {
    id: string;
    name: string;
    owner: {
        uid: string,
        displayName: string,
        photoURL: string,
    };
    private: boolean;
    currentSong?: Track;
};
