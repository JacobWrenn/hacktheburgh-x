import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map/Map"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-50 to-cyan-100">
      <Map colors={new Array(10000).fill("gray")}></Map>
      <ul className="flex justify-around text-gray-700 p-10 pt-20">
        <li className="text-gray-700">Points</li>
        <li>Rank</li>
        <li>clanrank</li>
      </ul>
      <h1 className="flex justify-center text-wrap text-gray-700 p-10">Somthing meaningfull Im to tired to write. Nam excepturi voluptatum necessitatibus praesentium. Porro nulla esse numquam dolores cumque laboriosam sit quidem. Mollitia facilis quia enim. Deserunt sit numquam nobis non dolor et aliquam et. Laudantium numquam porro similique at atque. Facilis delectus iure doloremque excepturi odit ut asperiores. Magni optio cum ut magni. Maxime quae consequatur voluptate eos unde quos.</h1>
    </div>
  );
}
