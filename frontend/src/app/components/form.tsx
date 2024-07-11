"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export const Form = () => {
  const [mode, setMode] = useState("signup");
  const [username, setUsername] = useState("");

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === "signup") {
      if (username !== "root") {
        alert("registered!");
        setMode("login");
      } else {
        alert("exist user!");
      }
    }
    if (mode === "login") {
      if (username === "root") {
        router.push("/main");
      } else {
        alert("failed");
      }
    }
  };

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
            <input
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setUsername(e.target.value);
              }}
            />
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