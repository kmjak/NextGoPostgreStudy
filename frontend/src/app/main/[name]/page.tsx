"use client";
import { useState, useEffect, useRef } from 'react';
import { getChatLog, getProfileByName, sendMsg } from '@/api';
import { APIChatLogData, APIProfileData } from '@/types';
import { useParams } from 'next/navigation';

export default function Show() {
  const params = useParams();
  const myName = params.name;
  const [mode, setMode] = useState<string>("server");
  const [selected, setSelected] = useState<string>("0a");
  const [selectedFriend, setSelectedFriend] = useState<number | null>(null);
  const [chatlog, setChatlog] = useState<APIChatLogData[] | null>(null);
  const [msg,setMsg] = useState<string>("");
  const [userMode, setUserMode] = useState<string>("active");
  const [profile, setProfile] = useState<APIProfileData[] | null>(null);
  const [profileMode, setProfileMode] = useState<string>("");
  const [profileName, setProfileName] = useState<string>(myName.toString());
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleChangeMode = async () => {
    setMode(mode === "server" ? "chat" : "server");
  }

  const handleSelectServer = async (name: string) => {
    setSelected(name+"a");
  }

  const handleSelectFriend = async (user_id: number) => {
    if(user_id !== null){
      ref.current?.focus();
      if(selectedFriend !== user_id){
        setSelectedFriend(user_id);
        if(selectedFriend != null){
          const chatlogs = await getChatLog(myName.toString(), selectedFriend.toString());
          setChatlog(chatlogs);
          setMsg("");
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

    
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetMode = () => {
      setUserMode("stop");
    };

    const handleMouseMove = () => {
      setUserMode("active");
      clearTimeout(timer);
      timer = setTimeout(resetMode, 1000);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
    };
  }, []);
  useEffect(() => {
    const fetchProfileData = async () => {
      const p = await getProfileByName(myName.toString());
      setProfile(p);
    }
    fetchProfileData();
  },[myName])

  const handleChangeProfileMode = async () => {
    setProfileMode(profileMode === "show" ? "" : "show");
  }
  const handleChangeProfile = async (name:string) => {
    setProfileName(name);
    setProfileMode("");
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
          <div>
            <section className="my-status-contain" onClick={handleChangeProfileMode}>
              <div className={`my-icon ${userMode}`}></div>
              <p className="my-name">{profileName}</p>
            </section>
            <div className="mode-msg">
              <hr className="mode-hr"/>
            </div>
            <div className={`change-profile-container ${profileMode}`}>
              {
                profile?.map((p) => {
                  return (
                    <div key={p.id} className="profile" onClick={() => handleChangeProfile(p.name)}>
                      <p>{p.name}</p>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
        :
        <div className="friend-contain">
          <div>
            <section className="my-status-contain" onClick={handleChangeProfileMode}>
              <div className={`my-icon ${userMode}`}></div>
              <p className="my-name">{profileName}</p>
            </section>
            <div className="mode-msg">
              <hr className="mode-hr"/>
            </div>
            <div className={`change-profile-container ${profileMode}`}>
              {
                profile?.map((p) => {
                  return (
                    <div key={p.id} className="profile" onClick={() => handleChangeProfile(p.name)}>
                      <p>{p.name}</p>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <ul>
            {profile?.map((p) => (
              <li className={`friend-status-contain ${selectedFriend == p.id ? ("selected") : ("")}`}
              key={p.id}
              onClick={() => handleSelectFriend(p.id)}
              >
                <span className='friend-icon stop'></span>
                {p.name}
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
                <h2 className='selected-friend-name'>
                  {
                    profile?.map((p) => {
                      if (p.id == selectedFriend){
                        return p.name;
                      }
                    })
                  }
                </h2>
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
              } value={msg}
              ref={ref}/>
              <button>✉️</button>
            </form>
          </div>
        </div>
      }    
    </main>
  );
}