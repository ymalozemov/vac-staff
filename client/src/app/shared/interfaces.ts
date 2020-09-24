export interface User {
  login?: string,
  password?: string,
  name?: string,
  _id?: string
}
export interface TimeTracking {
  _id?: string,
  startDay?: string,
  endDay?: string,
  steps?: [
    {
      name?: string,
      time?: string,
      deleted?: boolean,
      endTime?: string
    }
  ]
}
export interface Price {
  services?: [{
    value?: string,
    name?: string,
    cost?: number
  }],
  foxServices?: [{
    value?: string,
    name?: string,
    cost?: number
  }],
  date?: Date,
  user?: string
}
export interface News {
  user: String,
  userPosition: String,
  text: String
}
