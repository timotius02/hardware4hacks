import { type Item } from "@prisma/client";
import CheckoutItemModal from "./checkout-item-modal";
import EditItemModal from "./edit-item-modal";

interface ItemCardProps {
  item: Item;
}
export default function ItemCard(props: ItemCardProps) {
  const { item } = props;

  return (
    <div key={item.id} className="group relative">
      <div className="absolute top-2 right-2 z-10">
        <EditItemModal item={item} />
      </div>
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
        <img
          src={item.image}
          alt={item.imageAlt}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      <div className="flex justify-between">
        <div>
          <h3 className="mt-4 text-sm text-gray-700">{item.name}</h3>
          <p className="mt-1 text-lg font-medium text-gray-900">{item.count}</p>
        </div>
        <div className="flex items-center ">
          <CheckoutItemModal item={item} />
        </div>
      </div>
    </div>
  );
}
