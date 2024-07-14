import { getFriends } from '@/api';
import { APIFriendsData } from '@/types';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MyStatusComponent } from './mystatus';

export const FriendComponent = () => {
  const [friend, setFriend] = useState<APIFriendsData[] | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const params = useParams();
  const myName = params.name;

  useEffect(() => {
    const fetchFriendsData = async () => {
      const f = await getFriends(myName.toString());
      setFriend(f);
    }
    fetchFriendsData();
  }, [myName]);
  const handleSelectFriend = (name: string) => {
    setSelectedFriend(name);
  }
  return (
    <div className="channel-contain">
      <MyStatusComponent />
      <ul>
        {friend?.map((f) => (
          <li key={f.id} onClick={() => handleSelectFriend(myName === f.user1 ? f.user2 : f.user1)}>{myName === f.user1 ? f.user2 : f.user1}</li>
        ))}
      </ul>
    </div>
  )
}