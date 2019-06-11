import { Track } from "./Track";

export class Playlist{
    Href: string;
    Name: string;
    Tracks: Track[];
    NextTrackUrl: string;
    PreviousTrackUrl: string;
}