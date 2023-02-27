import { type Reservable } from "@prisma/client";
import { Dialog } from "@radix-ui/react-dialog";
import { Edit2 } from "lucide-react";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { api } from "~/utils/api";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface EditItemModalProps {
  reservable: Reservable;
}
export default function EditReservableModal(props: EditItemModalProps) {
  const { reservable } = props;
  const [name, setName] = useState(reservable.name);
  const [image, setImageLink] = useState(reservable.image);
  const [imageAlt, setImageAlt] = useState(reservable.imageAlt);
  const [date, setDate] = useState(reservable.date);
  const [startTime, setStartTime] = useState(reservable.startTime);
  const [endTime, setEndTime] = useState(reservable.endTime);
  const [timeInterval, setTimeInterval] = useState(reservable.timeInterval);
  const [open, setOpen] = useState(false);

  const utils = api.useContext();

  const router = useRouter();
  const { eventId } = router.query;

  const editReservable = api.hackathon.editReservable.useMutation({
    // Optimistic Update
    onMutate: async (newReservable) => {
      await utils.hackathon.getAllReservables.cancel();
      const previousReservables =
        utils.hackathon.getAllReservables.getData(hackathonId);
      const newReservables = previousReservables?.map((reservable) =>
        reservable.id === newReservable.id
          ? { ...newReservable, hackathonId }
          : reservable
      );
      utils.hackathon.getAllReservables.setData(hackathonId, newReservables);
      return { previousReservables };
    },
    // On error, we roll back
    onError: (err, newItem, context) => {
      if (context) {
        utils.hackathon.getAllReservables.setData(
          hackathonId,
          context.previousReservables
        );
      }
    },
    // Always refetch after error or success:
    onSettled: async () => {
      await utils.hackathon.getAllReservables.invalidate(hackathonId);
    },
  });

  const removeReservable = api.hackathon.removeReservable.useMutation({
    // Optimistic Update
    onMutate: async (id) => {
      await utils.hackathon.getAllReservables.cancel();
      const previousReservables =
        utils.hackathon.getAllReservables.getData(hackathonId);
      const newReservables = previousReservables?.filter(
        (reservables) => reservables.id !== id
      );
      utils.hackathon.getAllReservables.setData(hackathonId, newReservables);
      return { previousReservables };
    },
    // On error, we roll back
    onError: (err, newItem, context) => {
      if (context) {
        utils.hackathon.getAllReservables.setData(
          hackathonId,
          context.previousReservables
        );
      }
    },
    // Always refetch after error or success:
    onSettled: async () => {
      await utils.hackathon.getAllReservables.invalidate(hackathonId);
    },
  });

  const handleSubmit = useCallback(() => {
    editReservable.mutate({
      id: reservable.id,
      name,
      image,
      imageAlt,
      date,
      startTime,
      endTime,
      timeInterval,
    });
    setOpen(false);
  }, [
    reservable,
    name,
    image,
    imageAlt,
    date,
    startTime,
    endTime,
    editReservable,
    timeInterval,
  ]);

  const handleRemove = useCallback(() => {
    removeReservable.mutate(reservable.id);
    setOpen(false);
  }, [reservable, removeReservable]);

  if (!eventId) {
    return <div>404</div>;
  }

  let hackathonId: string;

  if (Array.isArray(eventId)) {
    hackathonId = eventId.join("");
  } else {
    hackathonId = eventId;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className=" w-10 rounded-full p-0">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Please add information about the new item
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Item Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="New Item"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageLink" className="text-right">
              Image Link
            </Label>
            <Input
              id="imageLink"
              name="imageLink"
              placeholder="https://example.com/image.png"
              value={image}
              onChange={(event) => setImageLink(event.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageAlt" className="text-right leading-normal">
              Image Alt Text
            </Label>
            <Input
              id="imageAlt"
              name="imageAlt"
              placeholder="New Item Alt Text"
              value={imageAlt}
              onChange={(event) => setImageAlt(event.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right leading-normal">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              name="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startTime" className="text-right leading-normal">
              Start Time
            </Label>
            <Input
              id="startTime"
              type="time"
              name="startTime"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endTime" className="text-right leading-normal">
              End Time
            </Label>
            <Input
              id="endTime"
              type="time"
              name="endTime"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timeInterval" className="text-right leading-normal">
              Interval
            </Label>
            <RadioGroup
              defaultValue="60"
              onValueChange={(value) => setTimeInterval(+value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="15" id="r1" />
                <Label htmlFor="r1" className="whitespace-nowrap">
                  15 min
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="30" id="r2" />
                <Label htmlFor="r2" className="whitespace-nowrap">
                  30 min
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="60" id="r3" />
                <Label htmlFor="r3" className="whitespace-nowrap">
                  1 hour
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={handleRemove}>
            Remove
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
