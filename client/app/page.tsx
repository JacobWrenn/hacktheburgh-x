import Image from "next/image";
import Map from "./Map/Map";

export default function Home() {
  return (
    // <Map events={[[55,3],[55.1,3.2]]} colors={new Array(10000).fill("gray")}></Map>
    <Map colors={new Array(10000).fill("gray")}></Map>
  );
}
