"use client";
import { useState, useEffect, useRef } from 'react';
import { changeAssignmentProfile, getChatLog, getFriendsProfileByID, getFriendsProfileByPidID, getProfileByName, sendMsg } from '@/api';
import { APIChatLogData, APIProfileData } from '@/types';
import { useParams, useRouter } from 'next/navigation';

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
  const [friendModal, setFriendModal] = useState<string>("show");
  const [mySetting, setMySetting] = useState<string>("hide");
  const [isSearchField, setIsSearchField] = useState<string>("hide");
  const [seartchWord, setSearchWord] = useState<string>("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const router = useRouter()


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
        const chatlog = await getChatLog(myName.toString(), user_id);
        setChatlog(chatlog);
        setSelectedFriend(user_id);
        setMsg("");
      }
    }
  }

  // useEffect(() => {
  //   let interval: NodeJS.Timeout;
  //   if (selectedFriend !== null) {
  //     const fetchChatLog = async () => {
  //       const chatlogs = await getChatLog(myName.toString(), selectedFriend);
  //       setChatlog(chatlogs);
  //     };

  //     interval = setInterval(fetchChatLog, 3000);

  //     fetchChatLog();
  //   }

  //   return () => clearInterval(interval);
  // }, [myName, selectedFriend]);

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

  const handleOpenProfileMode = async () => {
    setProfileMode("show");
    setMySetting("hide");
  }
  const handleCloseProfileMode = async () => {
    setProfileMode("");
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
    const elem = document.querySelector(".friend-setting-modal");
    setFriendSettingMode(friendSettingMode === "show" ? "hide" : "show");
    setProfileAssignmentMode("hide");
    setSearchWord("");
    setIsSearchField("hide");
  }

  const handleChangeProfileAssignment = async () => {
    setProfileAssignmentMode(profileAssignmentMode === "show" ? "hide" : "show");
    setIsSearchField("hide");
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


  const handleHideProfileChangeModal = async () => {
    setProfileAssignmentMode("hide");
  }
  const handleChangeFriendModal = async () => {
    setFriendModal(friendModal === "show" ? "hide" : "show");
    const elem = document.querySelector(".friend-modal-change-btn");
  }
  const handleMySettings = async () => {
    setMySetting(mySetting === "show" ? "hide" : "show");
  }
  const handleLogout = async ()=> {
    router.push("/")
  }
  const handleChangeSearchField = async () => { 
    setIsSearchField(isSearchField === "show" ? "hide" : "show");
    setProfileAssignmentMode("hide");
  }
  const handleSearchWord = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
    // if(selectedFriend !== null){
    //   if(e.target.value === ""){
    //     const chatlog = await getChatLog(myName.toString(), selectedFriend);
    //     setChatlog(chatlog);
    //   }else{
    //     const chatlog = await getSearchWord(myName.toString(), selectedFriend, e.target.value);
    //     setChatlog(chatlog);
    //   }
    // }
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
            <section className="my-status-contain" onClick={handleOpenProfileMode}>
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
        <div className={`friend-contain ${friendModal}`}>
          <div>
            <section className="my-status-contain" onClick={handleMySettings}>
              <div className={`my-icon ${userMode}`}></div>
              <p className="my-name">{profileName}</p>
            </section>
            <div className={`user-setting ${mySetting}`}>
              <p onClick={handleOpenProfileMode}>profile</p>
              <p onClick={handleLogout}>Log out</p>
            </div>
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
              <p className='add-profile'>add profile</p>
              <p className='add-profile' onClick={handleCloseProfileMode}>close</p>
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
      <button onClick={handleChangeFriendModal} className={`friend-modal-change-btn ${friendModal}`}>{friendModal == "show" ? "く" : ">"}</button>
      { mode == "server" ?
        <div className="chat-contain"></div>
      :
        <div className={`chat-contain ${friendSettingMode == "show" ? ("setting-open") : null} friend-contain-status-${friendModal}`}>
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
              <p className='setting' onClick={handleChangeProfileAssignment}>Change profile assignment</p>
              <p className='setting' onClick={handleChangeSearchField}>search word..</p>
              <p className='setting'>pinned</p>
              <p className='setting'>hide</p>
            </div>
            <div className={`change-profile-modal ${profileAssignmentMode === "hide" ? "hide" : "show"}`}>
              <h2 className='setting-title'>Assignment Profile</h2>
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
            <div className={`search-field ${isSearchField}`}>
              <label>
                {seartchWord === "" ? "Search Word.." : seartchWord}
                <input type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchWord(e)} value={seartchWord} className='search-input'/>
              </label>
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