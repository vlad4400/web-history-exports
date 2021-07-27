export interface Record {
  id?: string,
  title: string,
  username: string,
  local: string,
  date: Date
}

export interface FbCreateResponse {
  name: string
}

export interface Environment {
  production: boolean,
  apiKey: string,
  fbDatabaseUrl: string
}

export interface FbAuthResponse {
  idToken: string,
  expiresIn: string
}

export interface User {
  email: string,
  password: string,
  returnSecureToken: boolean
}
