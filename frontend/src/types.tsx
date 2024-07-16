export interface APIuserData {
  id: number;
  name: string;
  pass: string;
}
export interface APIChatLogData {
  id: number;
  from_pid: number;
  to_pid: number;
  from_id: number;
  to_id: number;
  msg: string;
}
export interface APIProfileData {
  id: number;
  user_id: string;
  name: string
}