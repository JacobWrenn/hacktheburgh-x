import Map from "./Map/Map";


    

import Navbar from "../app/components/Navbar";

export default function Home() {
  return (
    
    <div className="flex flex-col h-full">
      {/* <Map events={[[55,3],[55.1,3.2]]} colors={new Array(10000).fill("gray")}></Map> */}
    <Map colors={new Array(10000).fill("gray")}></Map>
      <Navbar/>
    </div>

  );
}
