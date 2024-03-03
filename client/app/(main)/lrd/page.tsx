"use client";

import useSWR from "swr";



export default function Home() {
  const { data, error, isLoading } = useSWR("/clan/leaderboard");
  if (isLoading) return <></>;

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-t from-slate-400 from-10% to-90% to-amber-500">
      <div className=" bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-lg px-8 py-4 w-80">
        <h1 className="text-xl font-bold text-center mb-4 text-gray-700">
          Leaderboard
        </h1>
        <table className="border-collapse justify-center text-center border border-gray-700 table-auto p-4 w-full text-gray-700">
          <thead>
            <th className="border border-gray-700">Rank</th>
            <th className="border border-gray-700">Guild</th>
            <th className="border border-gray-700">Hexagons</th>
          </thead>
          {data.map((row: any) => <tr key={row.guild}>
            <td className="border border-gray-700">{row.rank}</td>
            <td className="border border-gray-700">{row.guild}</td>
            <td className="border border-gray-700">{row.points}</td>
          </tr>)}
        </table>
      </div>
    </div>
  );
}
