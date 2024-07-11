"use client";

import { Metadata } from 'next';
import { getUsers } from '@/api';
import { APIuserData } from '@/types';
import { useEffect, useState } from 'react';




export default function Show() {
  const [data, setData] = useState<APIuserData[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUsers();
        setData(res);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {data ? (data.map((d) => {
        return (
          <div key={d.id}>
            <p>{d.id}</p>
            <p>{d.name}</p>
          </div>
        );
      })) : (<p>Loading...</p>)}
    </div>
  );
}
