"use client";
import { useState } from "react";
import { ChannelComponent } from "./channel";

export const ServerComponent = () => {
  const [selected, setSelected] = useState<string>("0a");
  const handleSelectServer = (name: string) => {
    setSelected(name+"a");
  }
  return (
    <div className="server-contain">
      <div className="server-content">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            className={`server-icon ${i.toString() + "a" == selected ? "selected" : null}`} key={i}
            onClick={()=>handleSelectServer(i.toString())}
          />  
        ))}
      </div>
      <ChannelComponent />
    </div>
  )
}