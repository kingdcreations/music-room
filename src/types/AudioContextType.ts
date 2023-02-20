import { Room, TrackData } from "./data";

export type AudioContextType = {
    data: TrackData | null;
    room: Room | null;
    join: (room: Room) => (void);
    quit: () => (void);
}