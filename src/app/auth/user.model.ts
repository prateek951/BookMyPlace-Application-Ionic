export class User {
  constructor(
    public id: string,
    public email: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  // Getter for the token
  get token() {
    // Check for the expiration of the token
    if (!this._tokenExpirationDate || this._tokenExpirationDate <= new Date()) {
      return null;
    }
    return this._token;
  }
}
