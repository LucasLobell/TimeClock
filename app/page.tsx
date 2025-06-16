import NavBar from "@/components/NavBar";
import Point from "@/components/Point";
import PointCard from "@/components/PointCard";

export default function Home() {
  return (
    <div className="">
      <NavBar iconHouse={false} />
      <div className="flex flex-row justify-self-center gap-8">
        <PointCard />
      </div>
    </div>
  );
}
