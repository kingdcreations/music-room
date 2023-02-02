export type Track = {
    id: string,
    dbId?: string,
    title: string,
    author: string,
    thumbnailUrl: string,
    vote: number
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
    playlist: Track[];
};
