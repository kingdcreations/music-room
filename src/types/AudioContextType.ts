import { Room, Track } from "./data";

export type AudioContextType = {
    data: Track | null;
    room: Room | null;
    join: (room: Room) => (void);
    quit: () => (void);
}