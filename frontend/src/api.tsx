import { APIuserData } from "./types";

export const getUsers = async ():Promise<APIuserData[]> => {
  // const res = await fetch("http://localhost:8080/users");
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'users');
  const ret = await res.json()
  return ret;
};