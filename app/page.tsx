import NavBar from "@/components/NavBar";
import Point from "@/components/Point";
import Pppp from "@/components/Pppp";

export default function Home() {
  return (
    <div className="">
      <NavBar iconHouse={false} />
      <Point />
      <div className="mx-10 my-10">
      <Pppp  />
      </div>
    </div>
  );
}
