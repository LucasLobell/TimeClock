import NavBar from "@/components/NavBar";
import Point from "@/components/Point";
import PointCard from "@/components/PointCard";
import TimeClock from "@/components/TimeClock";

export default function Home() {
  return (
    <div className="">
      <NavBar iconHouse={false} />
      <div className="">
        <TimeClock />
      </div>
    </div>
  );
}
