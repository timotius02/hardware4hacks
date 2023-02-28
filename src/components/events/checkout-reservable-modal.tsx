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
import TimePicker from "./time-picker";

interface CheckoutReservableModalProps {
  reservable: Reservable;
}
export default function CheckoutReservableModal(
  props: CheckoutReservableModalProps
) {
  const [open, setOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const { reservable } = props;
  const router = useRouter();
  const addReservableToCart = api.hackathon.addReservableToCart.useMutation();

  const handleSelected = useCallback((date: Date) => {
    setSelectedTime(date);
  }, []);

  const handleCheckout = useCallback(async () => {
    if (selectedTime) {
      addReservableToCart.mutate({
        reservableId: reservable.id,
        date: selectedTime,
      });

      await router.push("/checkout");
    }
  }, [addReservableToCart, reservable.id, router, selectedTime]);

  const addToCart = useCallback(() => {
    if (selectedTime) {
      setOpen(false);
      addReservableToCart.mutate({
        reservableId: reservable.id,
        date: selectedTime,
      });
    }
  }, [addReservableToCart, reservable.id, selectedTime]);
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
            onSelected={handleSelected}
          />
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
