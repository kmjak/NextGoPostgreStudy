
"use client";
import { getIdentificationUser, getProfile } from "@/api";
import { APIProfileData, APIuserData } from "@/types";
import { useState, useEffect } from "react";

interface myNameProps {
  myName: string;
}

export const MyStatusComponent = (myName:myNameProps) => {
  const [mode, setMode] = useState<string>("active");
  const [profile, setProfile] = useState<APIProfileData[] | null>(null);
  const [profileMode, setProfileMode] = useState<string>("");
  const [profileName, setProfileName] = useState<string>(myName.myName);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetMode = () => {
      setMode("stop");
    };

    const handleMouseMove = () => {
      setMode("active");
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
      const p = await getProfile(myName.myName);
      setProfile(p);
    }
    fetchProfileData();
  },[myName.myName])

  const handleChangeProfileMode = async () => {
    setProfileMode(profileMode === "show" ? "" : "show");
  }
  const handleChangeProfile = async (name:string) => {
    setProfileName(name);
    setProfileMode("");
  }
    
  return (
    <div>
      <section className="my-status-contain" onClick={handleChangeProfileMode}>
        <div className={`my-icon ${mode}`}></div>
        <p className="my-name">{profileName}</p>
      </section>
      <div className="mode-msg">
        <hr className="mode-hr"/>
      </div>
      <div className={`change-profile-container ${profileMode}`}>
        {
          <div className="profile" onClick={() => handleChangeProfile(myName.myName)}>
            <p>{myName.myName}</p>
          </div>
        }
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
  );
};