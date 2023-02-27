import { type Item } from "@prisma/client";
import { Plus } from "lucide-react";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { api } from "~/utils/api";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface CheckoutItemModalProps {
  item: Item;
}
export default function CheckoutItemModal(props: CheckoutItemModalProps) {
  const [checkoutCount, setCheckoutCount] = useState(1);
  const [open, setOpen] = useState(false);
  const { item } = props;
  const router = useRouter();
  const utils = api.useContext();
  const addItemToCart = api.hackathon.addItemToCart.useMutation({
    // Optimistic Update
    onMutate: async ({ itemId, quantity }) => {
      await utils.hackathon.getItemsInCart.cancel();
      const previousEntries = utils.hackathon.getItemsInCart.getData();

      const newEntry = {
        itemId,
        userId: "test",
        quantity,
        addedOn: new Date(),
        item,
      };

      let newEntries: typeof previousEntries;

      if (!previousEntries) {
        newEntries = [newEntry];
      } else {
        const index = previousEntries?.findIndex(
          (entry) => entry.itemId === itemId
        );

        if (index === undefined) {
          newEntries = previousEntries
            ? [...previousEntries, newEntry]
            : [newEntry];
        } else {
          newEntries = previousEntries.map((entry) =>
            entry.itemId === itemId ? newEntry : entry
          );
        }
      }
      utils.hackathon.getItemsInCart.setData(undefined, newEntries);
      return { previousEntries };
    },
    // On error, we roll back
    onError: (err, newItem, context) => {
      if (context) {
        utils.hackathon.getItemsInCart.setData(
          undefined,
          context.previousEntries
        );
      }
    },
    // Always refetch after error or success:
    onSettled: async () => {
      await utils.hackathon.getItemsInCart.invalidate();
    },
  });

  const handleCheckout = useCallback(async () => {
    addItemToCart.mutate({
      itemId: item.id,
      quantity: checkoutCount,
    });

    await router.push("/checkout");
  }, [addItemToCart, checkoutCount, item.id, router]);

  const addToCart = useCallback(() => {
    setOpen(false);
    addItemToCart.mutate({
      itemId: item.id,
      quantity: checkoutCount,
    });
  }, [addItemToCart, checkoutCount, item.id]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className=" h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Checkout Item</DialogTitle>
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
            <img
              src={item.image}
              alt={item.imageAlt}
              className="h-full w-full object-cover object-center group-hover:opacity-75"
            />
          </div>
          <DialogDescription>
            How many <span className="font-bold">{item.name}(s)</span> are you
            checking out?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="count" className="text-right leading-normal">
              Count
            </Label>
            <Input
              id="count"
              type="number"
              name="count"
              max={item.count}
              min={1}
              value={checkoutCount}
              onChange={(event) => setCheckoutCount(+event.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => addToCart()}>
            Add to Cart
          </Button>
          <Button type="submit" onClick={() => void handleCheckout()}>
            Checkout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
