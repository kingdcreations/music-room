export type Track = {
    id: string,
    title: string,
    author: string,
    thumbnailUrl: string
}

export type Room = {
    id: string;
    name: string;
    owner: string;
    private: boolean;
    playlist: Track[];
};
