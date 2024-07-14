"use client";
import { useState, useEffect } from 'react';
import { MyStatusComponent } from './components/mystatus';
import { getChatLog, getFriends, sendMsg } from '@/api';
import { APIChatLogData, APIFriendsData } from '@/types';
import { useParams } from 'next/navigation';

export default function Show() {
  const [mode, setMode] = useState<string>("server");
  const [selected, setSelected] = useState<string>("0a");
  const [friend, setFriend] = useState<APIFriendsData[] | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [chatlog, setChatlog] = useState<APIChatLogData[] | null>(null);
  const [msg,setMsg] = useState<string>("");
  const params = useParams();
  const myName = params.name;

  const handleChangeMode = async () => {
    setMode(mode === "server" ? "chat" : "server");
  }

  const handleSelectServer = async (name: string) => {
    setSelected(name+"a");
  }

  useEffect(() => {
    const fetchFriendsData = async () => {
      const f = await getFriends(myName.toString());
      setFriend(f);
    }
    fetchFriendsData();
  }, [myName]);

  const handleSelectFriend = async (friend: string) => {
    if(friend !== null){
      if(selectedFriend !== friend){
        setSelectedFriend(friend);
        if(selectedFriend != null){
          const chatlogs = await getChatLog(myName.toString(), selectedFriend.toString());
          setChatlog(chatlogs);
        }
      }
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (selectedFriend !== null) {
      const fetchChatLog = async () => {
        const chatlogs = await getChatLog(myName.toString(), selectedFriend.toString());
        setChatlog(chatlogs);
      };

      interval = setInterval(fetchChatLog, 3000);

      fetchChatLog();
    }

    return () => clearInterval(interval);
  }, [myName, selectedFriend]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (msg !== ""){
      if (selectedFriend !== null){
        await sendMsg(selectedFriend.toString(), myName.toString(), msg);
        setMsg("");
        const chatlogs = await getChatLog(myName.toString(), selectedFriend.toString());
        setChatlog(chatlogs);
      }
    }
  }

  return (
    <main className='chat-container'>
      <div className="left-side">
        <p className="mode-icon" onClick={() => handleChangeMode()}>{mode == "server" ? "🏠" : "💬"}</p>
        <div className="mode-group-hr"></div>
        {mode == "server" ? 
          <div className="server-contain">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                className={`server-icon ${i.toString() + "a" == selected ? "selected" : null}`} key={i}
                onClick={()=>handleSelectServer(i.toString())}
              />  
            ))}
          </div>
        :
          <div className="story-contain">
            {Array.from({ length: 5 }).map((_, i) => (
              <div className="story-icon" key={i}></div>
            ))}
          </div>
        }
      </div>
      {mode == "server" ? 
        <div className="channel-contain">
          <MyStatusComponent />
          {selected}
        </div>
        :
        <div className="friend-contain">
          <MyStatusComponent />
          <ul>
            {friend?.map((f) => (
              <li className={`friend-status-contain ${(selectedFriend === f.user1 || selectedFriend === f.user2) ? ("selected") : ("null")}`}
              key={f.id}
              onClick={() => handleSelectFriend(myName === f.user1 ? f.user2 : f.user1)}
              >
                <span className='friend-icon stop'></span>
                {myName === f.user1 ? f.user2 : f.user1}
              </li>
            ))}
          </ul>
        </div>
      }
      {mode == "server" ?
        <div className="chat-contain"></div>
      :
        <div className="chat-contain">
          <div className="chat-content">
            <div className="friend-option">
              <div className="none" />
              <div className="selected-friend">
                <div className='friend-icon'/>
                <h2 className='selected-friend-name'>{selectedFriend}</h2>
              </div>
              <div className="friend-detail">三</div>
            </div>
            <hr className='friend-hr' />
            {chatlog?.map((chat) => (
              chat.from === myName ? (
                <div className="chat-friend left" key={chat.id}>
                  <div className="chat-friend-icon" />
                  <div>
                    <p className="chat-friend-name">{chat.to}</p>
                    <div className="chat-log">
                      <p className="chat-msg">{chat.msg}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="chat-friend right" key={chat.id}>
                  <div>
                    <p className="chat-friend-name">{chat.to}</p>
                    <div className="chat-log">
                      <p className="chat-msg">{chat.msg}</p>
                    </div>
                  </div>
                  <div className="chat-friend-icon" />
                </div>
              )
            ))}
          </div>
          <div className="chat-form">
            <div className="form-option">+</div>
            <form className="form" onSubmit={handleSubmit}>
              <textarea onChange={
                (e: React.ChangeEvent<HTMLTextAreaElement>) => setMsg(e.target.value)
              } value={msg}/>
              <button>✉️</button>
            </form>
          </div>
        </div>
      }    
    </main>
  );
}