

export default function Home() {
    const leaderboard = [{rank: 1, guild: 'Thimases mum', points: 5}];
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
          {leaderboard.map(({rank, guild, points}) => <tr key={guild}>
            <td className="border border-gray-700">{rank}</td>
            <td className="border border-gray-700">{guild}</td>
            <td className="border border-gray-700">{points}</td>
          </tr>)}
        </table>
      </div>
    </div>
  );
}
