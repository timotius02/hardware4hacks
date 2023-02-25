import { Plus } from "lucide-react";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { api } from "~/utils/api";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const defaults = {
  name: "New Item",
  image: "http://example.com/image.png",
  imageAlt: "New Item Alt Text",
  date: "",
  startTime: "",
  endTime: "",
};

export default function NewReservableButton() {
  const [name, setName] = useState(defaults.name);
  const [image, setImageLink] = useState(defaults.image);
  const [imageAlt, setImageAlt] = useState(defaults.imageAlt);
  const [date, setDate] = useState(defaults.date);
  const [startTime, setStartTime] = useState(defaults.startTime);
  const [endTime, setEndTime] = useState(defaults.endTime);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { eventId } = router.query;
  let hackathonId: string;

  const utils = api.useContext();

  const addReservable = api.hackathon.addReservable.useMutation({
    // Optimistic Update
    onMutate: async (newReservable) => {
      await utils.hackathon.getAllReservables.cancel();
      const previousReservables =
        utils.hackathon.getAllReservables.getData(hackathonId);
      if (previousReservables) {
        const newReservables = [
          ...previousReservables,
          { ...newReservable, id: "temp" },
        ];
        utils.hackathon.getAllReservables.setData(hackathonId, newReservables);
      }
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

  if (!eventId) {
    throw new Error("event Id not provided");
  }
  if (Array.isArray(eventId)) {
    hackathonId = eventId.join("");
  } else {
    hackathonId = eventId;
  }

  const handleSubmit = useCallback(() => {
    addReservable.mutate({
      name,
      image,
      imageAlt,
      hackathonId,
      date,
      startTime,
      endTime,
    });
    console.log(startTime, endTime);
    setOpen(false);
    setName(defaults.name);
    setImageLink(defaults.image);
    setImageAlt(defaults.imageAlt);
    setDate(defaults.date);
    setStartTime(defaults.startTime);
    setEndTime(defaults.endTime);
  }, [
    name,
    image,
    imageAlt,
    hackathonId,
    date,
    startTime,
    endTime,
    addReservable,
  ]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Item
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
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
