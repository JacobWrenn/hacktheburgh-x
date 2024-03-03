"use client";

import useSWR from "swr";

export default function Home() {
  const { data, error, isLoading } = useSWR("/user/profile");

  if (isLoading) return <></>;

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-t from-slate-400 from-10% to-90% to-indigo-500">
      <div className=" bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-lg px-8 py-4 w-80">
        <ul className="flex flex-col justify-center items-center text-gray-700 relative">
          <li className="extremlYroundbox absolute">
            <div className="onesingularnumber text-5xl text-gray-700">
              {data.rank}
            </div>
          </li>
          <li className="relative pt-8 pb-1">
            <table className="border-separate border-spacing-x-1 border-spacing-y-2">
              <tr>
                <td className="font-bold">Username:</td>
                <td className="text-right">{data.username}</td>
              </tr>
              <tr>
                <td className="font-bold">Guild:</td>
                <td className="text-right">{data.clan}</td>
              </tr>
              <tr>
                <td className="font-bold">Points:</td>
                <td className="text-right">{data.points}</td>
              </tr>
            </table>
          </li>
        </ul>
      </div>
    </div>
  );
}
