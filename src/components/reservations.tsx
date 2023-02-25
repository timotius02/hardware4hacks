import { type Reservable } from "@prisma/client";
import NewReservableButton from "./new-reservable-button";
import ReservableCard from "./reservable-card";

interface ReservationsProps {
  reservables: Reservable[];
}
export function Reservations(props: ReservationsProps) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Reservations
          </h2>
          <NewReservableButton />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {props.reservables.map((reservable) => (
            <ReservableCard key={reservable.id} reservable={reservable} />
          ))}
        </div>
      </div>
    </div>
  );
}
