export type LoginRequest = {
  type: "reg",
  data: LoginRequestData
  id: 0,
}

export type LoginResponse = {
  type: "reg",
  data: LoginResponseData | string
  id: 0,
}

export type LoginRequestData = {      
  name: string,
  password: string,
}

export type LoginResponseData = {
  name: string,
  index: number | string,
  error: boolean,
  errorText: string,
}