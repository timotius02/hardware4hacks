import { type Item } from "@prisma/client";
import { useSession } from "next-auth/react";
import ItemCard from "./item-card";
import NewItemButton from "./new-item-button";

interface InventoryProps {
  items: Item[];
}
export function Inventory(props: InventoryProps) {
  const { data: session } = useSession();

  const user = session?.user;
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Inventory
          </h2>
          {user && <NewItemButton />}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {props.items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
