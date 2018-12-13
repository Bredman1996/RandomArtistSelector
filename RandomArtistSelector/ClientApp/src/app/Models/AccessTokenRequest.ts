export class AccessTokenRequest {
  grant_type: string;
  code: string;
  redirect_uri: string;
  client_id: string;
  client_secret: string;

  constructor(grant_type: string, code: string, redirect_uri: string, client_id: string, client_secret: string) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.code = code;
    this.grant_type = grant_type;
    this.redirect_uri = redirect_uri;
  }
}
