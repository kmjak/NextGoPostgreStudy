import { APIuserData } from "./types";

export const getUsers = async ():Promise<APIuserData[]> => {
  const res = await fetch("http://localhost:8080/get/users");
  // const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'users');
  const ret = await res.json()
  return ret;
};
export const getIdentificationUser = async (username: string): Promise<APIuserData | null> => {
  try {
    const res = await fetch(`http://localhost:8080/get/user/${username}`);
    if (!res.ok) {
      throw new Error("Failed to fetch user data");
    }
    const ret = await res.json();
    return ret;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
export const addUser = async (username: string, password :string) => {
  const res = await fetch("http://localhost:8080/add/user/" + username + "/" + password);
}