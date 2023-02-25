import { type Reservable } from "@prisma/client";
import EditReservableModal from "./edit-reservable-modal";

interface ReservableCardProps {
  reservable: Reservable;
}
export default function ReservableCard(props: ReservableCardProps) {
  const { reservable } = props;

  return (
    <div key={reservable.id} className="group relative">
      <div className="absolute top-2 right-2 z-10">
        <EditReservableModal reservable={reservable} />
      </div>
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
        <img
          src={reservable.image}
          alt={reservable.imageAlt}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{reservable.name}</h3>
      {/* <p className="mt-1 text-lg font-medium text-gray-900">{reservable.count}</p> */}
    </div>
  );
}
