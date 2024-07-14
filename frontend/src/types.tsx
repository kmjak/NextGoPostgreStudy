export interface APIuserData {
  id: number;
  name: string;
  pass: string;
}
export interface APIFriendsData {
  id: number;
  user1: string;
  user2: string;
}
export interface APIChatLogData {
  id: number;
  from: string;
  to: string;
  msg: string;
}