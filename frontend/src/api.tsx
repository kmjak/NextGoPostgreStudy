import { APIChatLogData, APIProfileData, APIuserData } from "./types";

// get users
export const getUsers = async ():Promise<APIuserData[]> => {
  const res = await fetch("http://localhost:8080/get/users");
  // const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'users');
  const ret = await res.json()
  return ret;
};

// get user
export const getIdentificationUser = async (username: string): Promise<APIuserData[] | null> => {
  const res = await fetch(`http://localhost:8080/get/user/${username}`);
  const ret = await res.json();
  return ret;
};

// get profile
export const getProfileByName = async (name:string):Promise<APIProfileData[]> => {
  const res = await fetch(`http://localhost:8080/get/profile/${name}`);
  const ret = await res.json();
  return ret;
}

// get friends profile
export const getFriendsProfileByID = async (name:string):Promise<APIProfileData[]> => {
  const res = await fetch(`http://localhost:8080/get/friends/id/${name}`);
  const ret = await res.json();
  return ret;
}
export const getFriendsProfileByPidID = async (name:string, pname:string):Promise<APIProfileData[]> => {
  const res = await fetch(`http://localhost:8080/get/friends/pid/${name}/${pname}`);
  const ret = await res.json();
  return ret;
}

// get chatlog
export const getChatLog = async (name:string,pid:number): Promise<APIChatLogData[]> => {
  const res = await fetch(`http://localhost:8080/get/chatlog/${name}/${pid}`);
  const ret = await res.json();
  return ret;
}

//send msg
export const sendMsg = async (from_name:string, to_pid:number, msg:string) => {
  const res = await fetch(`http://localhost:8080/send/msg/${from_name}/${to_pid}/${msg}`);
}

// create user
export const addUser = async (username: string, password :string) => {
  const res = await fetch(`http://localhost:8080/add/user/${username}/${password}`);
  const ret = await res.json();
  return ret;
}

// change Assignment profile
export const changeAssignmentProfile = async (name:string, pname:string, friendPid:number) => {
  await fetch(`http://localhost:8080/change/assignment/${name}/${pname}/${friendPid}`);
}