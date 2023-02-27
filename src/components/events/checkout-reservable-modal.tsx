import { type Reservable } from "@prisma/client";
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
import TimePicker from "./time-picker";

interface CheckoutReservableModalProps {
  reservable: Reservable;
}
export default function CheckoutReservableModal(
  props: CheckoutReservableModalProps
) {
  const [checkoutCount, setCheckoutCount] = useState(1);
  const [open, setOpen] = useState(false);
  const { reservable } = props;
  const router = useRouter();
  const utils = api.useContext();
  // const addItemToCart = api.hackathon.addItemToCart.useMutation({
  //   // Optimistic Update
  //   onMutate: async ({ itemId, quantity }) => {
  //     await utils.hackathon.getItemsInCart.cancel();
  //     const previousEntries = utils.hackathon.getItemsInCart.getData();

  //     const newEntry = {
  //       itemId,
  //       userId: "test",
  //       quantity,
  //       addedOn: new Date(),
  //       item,
  //     };

  //     let newEntries: typeof previousEntries;

  //     if (!previousEntries) {
  //       newEntries = [newEntry];
  //     } else {
  //       const index = previousEntries?.findIndex(
  //         (entry) => entry.itemId === itemId
  //       );

  //       if (index === undefined) {
  //         newEntries = previousEntries
  //           ? [...previousEntries, newEntry]
  //           : [newEntry];
  //       } else {
  //         newEntries = previousEntries.map((entry) =>
  //           entry.itemId === itemId ? newEntry : entry
  //         );
  //       }
  //     }
  //     utils.hackathon.getItemsInCart.setData(undefined, newEntries);
  //     return { previousEntries };
  //   },
  //   // On error, we roll back
  //   onError: (err, newItem, context) => {
  //     if (context) {
  //       utils.hackathon.getItemsInCart.setData(
  //         undefined,
  //         context.previousEntries
  //       );
  //     }
  //   },
  //   // Always refetch after error or success:
  //   onSettled: async () => {
  //     await utils.hackathon.getItemsInCart.invalidate();
  //   },
  // });

  const handleCheckout = useCallback(async () => {
    // addItemToCart.mutate({
    //   itemId: item.id,
    //   quantity: checkoutCount,
    // });

    await router.push("/checkout");
  }, [router]);

  const addToCart = useCallback(() => {
    setOpen(false);
    // addItemToCart.mutate({
    //   itemId: item.id,
    //   quantity: checkoutCount,
    // });
  }, []);
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

          <DialogDescription>
            Make a reservation for{" "}
            <span className="font-bold">{reservable.name}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* <div className="grid grid-cols-4 items-center gap-4">
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
          </div> */}
          <TimePicker
            reservableId={reservable.id}
            // date={reservable.date}
            // startTime={reservable.startTime}
            // endTime={reservable.endTime}
            // interval={reservable.timeInterval}
          />
        </div>
        {/* <DialogFooter>
          <Button variant="outline" onClick={() => addToCart()}>
            Add to Cart
          </Button>
          <Button type="submit" onClick={() => void handleCheckout()}>
            Checkout
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
