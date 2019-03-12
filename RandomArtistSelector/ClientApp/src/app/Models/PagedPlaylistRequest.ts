import { PlaylistRequest } from "./PlaylistRequest";

export class PagedPlaylistRequest extends PlaylistRequest {
  public getUrl: string;
  constructor(accessToken: any, userUrl: any, getUrl: string) {
    super(accessToken, userUrl);
    this.getUrl = getUrl;
  }
}
