import { APIChatLogData, APIFriendsData, APIProfileData, APIuserData } from "./types";

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

// get chatlog
export const getChatLog = async (uname:string,friend:string): Promise<APIChatLogData[]> => {
  const res = await fetch(`http://localhost:8080/get/chatlog/${uname}/${friend}`);
  const ret = await res.json();
  return ret;
}

//send msg
export const sendMsg = async (form:string, to:string, msg:string) => {
  const res = await fetch(`http://localhost:8080/send/msg/${form}/${to}/${msg}`);
}

// create user
export const addUser = async (username: string, password :string) => {
  const res = await fetch(`http://localhost:8080/add/user/${username}/${password}`);
  const ret = await res.json();
  return ret;
}
