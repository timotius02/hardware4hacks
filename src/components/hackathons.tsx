import HackathonCard, { type hackathon } from "./hackathon-card";

interface HackathonsProps {
  hackathons: hackathon[];
}

export default function Hackathons(props: HackathonsProps) {
  return (
    <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {props.hackathons.map((hackathon) => (
          <HackathonCard key={hackathon.code} hackathon={hackathon} />
        ))}
      </div>
    </div>
  );
}
