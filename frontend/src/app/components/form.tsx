"use client";

import { getIdentificationUser, addUser } from "@/api";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export const Form = () => {
  const [mode, setMode] = useState("signup");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(username === "" || password === "") {
      alert("input username and password");
      return;
    }
    const user = await getIdentificationUser(username);
    if (mode === "signup") {
      if (user === null) {
        await addUser(username,password);
        alert("registered!");
        setMode("login");
      } else {
        alert("exist user!");
      }
    }
    if (mode === "login") {
      if (user !== null) {
        if (user.pass != password) {
          alert("password is wrong");
          return;
        }
        router.push("/main");
      } else {
        alert("failed");
      }
    }
  }

  const handleChangeMode = () => {
    setMode(mode === "signup" ? "login" : "signup");
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h3 className="auth-title">{mode}</h3>
        <p>
          <label>
            user name
            <input type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUsername(e.target.value); }}/>
          </label>
        </p>
        <p>
          <label>
            password
            <input type="password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); }}/>
          </label>
        </p>
        <p>
          <button type="submit">click</button>
        </p>
      </form>
      <p>
        <button onClick={handleChangeMode}>Change Mode</button>
      </p>
    </div>
  );
};