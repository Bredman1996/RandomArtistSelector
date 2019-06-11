import { Track } from "./Track";

export class GetTracksResponse{
    Tracks: Track[];
    NextTrackUrl: string;
    PreviousTrackUrl: string;
}