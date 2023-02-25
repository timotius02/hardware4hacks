import { type Hackathon } from "@prisma/client";
import Link from "next/link";

interface HackathonProps {
  hackathon: Hackathon;
}
export default function HackathonCard(props: HackathonProps) {
  return (
    <Link title={props.hackathon.name} href={`/event/${props.hackathon.id}`}>
      <div className="overflow-hidden rounded border border-gray-300 bg-white">
        <div className="h-52 overflow-hidden">
          <img
            className="object-cover"
            src={props.hackathon.banner}
            alt={"Backgroundsplash" + props.hackathon.id}
          />
        </div>
        <div className="relative flex flex-col items-center gap-1 pb-4">
          <div className="-mt-10 h-16 w-16 overflow-hidden rounded border-4 border-white">
            <img src={props.hackathon.banner} alt={props.hackathon.id} />
          </div>
          <h3 className="font-bold">{props.hackathon.name}</h3>
          <p className="event-date">Feb 18th - 19th </p>
          <div>
            <span itemProp="city">{props.hackathon.city}</span>,&nbsp;
            <span itemProp="state">{props.hackathon.state}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
