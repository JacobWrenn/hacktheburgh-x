"use client";

import dynamic from "next/dynamic";

import useSWR from "swr";

const Map = dynamic(() => import("./Map/Map"), {
  ssr: false,
});

export default function Home() {
  const { data, isLoading } = useSWR("/hexagon/colours");
  const { data: userData, isLoading: userIsLoading } = useSWR("/user/profile");
  const { data: clanData, isLoading: clanIsLoading } = useSWR("/clan/ranking");

  if (isLoading || userIsLoading || clanIsLoading) return <></>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-50 to-cyan-100">
      <ul className="flex justify-around text-gray-700 p-10 pt-14">
        <div className="flex flex-col items-center justify-center gap-2">
          <li className="text-3xl">{userData.points}</li>
          <li>Points</li>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <li className="text-3xl">{userData.rank}</li>
          <li>Rank</li>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <li className="text-3xl">{clanData}</li>
          <li>Clan Rank</li>
        </div>
      </ul>
      <Map colors={data}></Map>
      <h1 className="flex justify-center text-wrap text-gray-700 p-10 text-center">
        Welcome to Eco-Warriors! Start a new litter pick with the globe button
        to begin collecting hexagons for your clan!
      </h1>
    </div>
  );
}
