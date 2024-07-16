export interface APIuserData {
  id: number;
  name: string;
  pass: string;
}
export interface APIFriendsData {
  id: number;
  user_id: number;
  name: string;
}
export interface APIChatLogData {
  id: number;
  from: string;
  to: string;
  msg: string;
}
export interface APIProfileData {
  id: number;
  user_id: string;
  name: string
}