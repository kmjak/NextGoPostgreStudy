"use client";
import { useState, useEffect, useRef } from 'react';
import { changeAssignmentProfile, getChatLog, getFriendsProfileByID, getFriendsProfileByPidID, getProfileByName, sendMsg } from '@/api';
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
  const [friendProfile, setFriendProfile] = useState<APIProfileData[] | null>(null);
  const [profileName, setProfileName] = useState<string>(myName.toString());
  const [friendSettingMode, setFriendSettingMode] = useState<string>("hide");
  const [profileAssignmentMode, setProfileAssignmentMode] = useState<string>("hide");
  const eventSourceRef = useRef<EventSource | null>(null);
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
        setMsg("");
      }
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedFriend !== null) {
      const fetchChatLog = async () => {
        const chatlogs = await getChatLog(myName.toString(), selectedFriend);
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
        await sendMsg(myName.toString() ,selectedFriend, msg);
        setMsg("");
        const chatlogs = await getChatLog(myName.toString(), selectedFriend);
        setChatlog(chatlogs);
      }
    }
  }

  useEffect(() => {
    const fetchProfileData = async () => {
      const p = await getProfileByName(myName.toString());
      const f = await getFriendsProfileByID(myName.toString());
      setProfile(p);
      setFriendProfile(f);
    }
    fetchProfileData();
  },[myName])

  const handleChangeProfileMode = async () => {
    setProfileMode(profileMode === "show" ? "" : "show");
  }
  const handleChangeProfile = async (name:string) => {
    setProfileName(name);
    if(name == myName){
      const f = await getFriendsProfileByID(myName.toString());
      setFriendProfile(f);
    }else{
      const f = await getFriendsProfileByPidID(myName.toString(), name);
      setFriendProfile(f);
    }
    setProfileMode("");
    setSelectedFriend(null);
    setChatlog(null);
  }

  const handleSettings = async () => {
    setFriendSettingMode(friendSettingMode === "show" ? "hide" : "show");
    setProfileAssignmentMode("hide");
  }

  const handleChangeProfileAssignment = async () => {
    setProfileAssignmentMode(profileAssignmentMode === "show" ? "hide" : "show");
  }

  const handleChangeProfileAssignmentData = async (name:string) => {
    if(selectedFriend != null){
      await changeAssignmentProfile(myName.toString(), name, selectedFriend);
      
      const f = await getFriendsProfileByID(myName.toString());
      setFriendProfile(f);
      
      const p = await getProfileByName(myName.toString());
      setProfile(p);
      
      const chatlog = await getChatLog(myName.toString(), selectedFriend);
      setChatlog(chatlog);
      
      setProfileName(name);
      
      setProfileAssignmentMode("hide");
      setFriendSettingMode("hide");
    }
  }
  useEffect(() => {
    const updateFriendProfiles = async () => {
      if (profileName === myName.toString()) {
        const f = await getFriendsProfileByID(myName.toString());
        setFriendProfile(f);
      } else {
        const f = await getFriendsProfileByPidID(myName.toString(), profileName);
        setFriendProfile(f);
      }
    };
    
    updateFriendProfiles();
  }, [profileName, myName]);

  const handleCloseFriendSettingModal = async () => {
    setFriendSettingMode("hide");
  }

  const handleHideProfileChangeModal = async () => {
    setProfileAssignmentMode("hide");
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
            {friendProfile?.map((p) => (
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
      { mode == "server" ?
        <div className="chat-contain"></div>
      :
        <div className={`chat-contain ${friendSettingMode == "show" ? ("setting-open") : null}`}>
          <div className="chat-content">
            <div className="friend-option">
              <div className="none" />
              <div className="selected-friend">
                <div className='friend-icon'/>
                <h2 className='selected-friend-name'>
                  {friendProfile?.find((p) => p.id === selectedFriend)?.name}
                </h2>
              </div>
              <div className="friend-detail" onClick={handleSettings}>三</div>
            </div>
            <div className={`friend-setting-modal ${friendSettingMode}`}>
              <h1 className='setting-title'>settings</h1>
              <p className='setting' onClick={handleChangeProfileAssignment}>Change profile assignment</p>
              <p className='setting-close' onClick={handleCloseFriendSettingModal}>close</p>
            </div>
            <div className={`change-profile-modal ${profileAssignmentMode === "hide" ? "hide" : "show"}`}>
              <h2 className='setting-title'>Profile</h2>
              {
                profile?.map((p) => {
                  return (
                    <div key={p.id} className="change-profiles" onClick={() => handleChangeProfileAssignmentData(p.name)}>
                      <p>{p.name}</p>
                    </div>
                  )
                })
              }
              <p className="change-profiles" onClick={handleHideProfileChangeModal}>back..</p>
            </div>
            <hr className='friend-hr' />
            {chatlog?.map((chat) => (
              chat.from_pid == selectedFriend ? (
                <div className="chat-friend left" key={chat.id}>
                  <div className="chat-friend-icon" />
                  <div>
                    <p className="chat-friend-name">{friendProfile?.find((p) => p.id == chat.from_pid)?.name}</p>
                    <div className="chat-log">
                      <p className="chat-msg">{chat.msg}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="chat-friend right" key={chat.id}>
                  <div>
                    <p className="chat-friend-name">{profile?.find((p) => p.id == chat.from_pid)?.name}</p>
                    <div className="chat-log">
                      <p className="chat-msg">{chat.msg}</p>
                    </div>
                  </div>
                  <div className="chat-friend-icon" />
                </div>
              )
            ))}
          </div>
          {
            selectedFriend !== null ? 
            (
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
            ) : null
          }
        </div>
      }    
    </main>
  );
}