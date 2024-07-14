"use client";
import { useState } from "react";
import { StoryComponent } from "./story";
import { ServerComponent } from "./server";
import { ChannelComponent } from "./channel";
import { FriendComponent } from "./friend";

export const ShowChatComponent =() => {
  const [mode, setMode] = useState<string>("server");
  const handleChangeMode = () => {
    setMode(mode === "server" ? "chat" : "server");
  }
  return (
    <main className='chat-container'>
      <div className="left-side">
        <p className="mode-icon" onClick={() => handleChangeMode()}>{mode == "server" ? "🏠" : "💬"}</p>
        <div className="mode-group-hr"></div>
        {mode == "server" ? <ServerComponent /> : <StoryComponent />}
      </div>
    </main>
  )
}