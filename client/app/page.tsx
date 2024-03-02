import Image from "next/image";
import Map from "./Map/Map";

export default function Home() {
  return (
    <Map colors={new Array(10000).fill("gray")}></Map>
  );
}
