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

const defaults = {
  name: "New Item",
  image: "http://example.com/image.png",
  imageAlt: "New Item Alt Text",
  count: 0,
};
export default function NewItemButton() {
  const [name, setName] = useState(defaults.name);
  const [image, setImageLink] = useState(defaults.image);
  const [imageAlt, setImageAlt] = useState(defaults.imageAlt);
  const [count, setCount] = useState(defaults.count);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { eventId } = router.query;
  let hackathonId: string;

  const utils = api.useContext();

  const addItem = api.hackathon.addItem.useMutation({
    // Optimistic Update
    onMutate: async (newItem) => {
      await utils.hackathon.getAllItems.cancel();
      const previousItems = utils.hackathon.getAllItems.getData(hackathonId);
      if (previousItems) {
        const newItems = [...previousItems, { ...newItem, id: "temp" }];
        utils.hackathon.getAllItems.setData(hackathonId, newItems);
      }
      return { previousItems };
    },
    // On error, we roll back
    onError: (err, newItem, context) => {
      if (context) {
        utils.hackathon.getAllItems.setData(hackathonId, context.previousItems);
      }
    },
    // Always refetch after error or success:
    onSettled: async () => {
      await utils.hackathon.getAllItems.invalidate(hackathonId);
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
    addItem.mutate({
      name,
      image,
      imageAlt,
      count,
      hackathonId,
    });
    setOpen(false);
    setName(defaults.name);
    setImageLink(defaults.image);
    setImageAlt(defaults.imageAlt);
    setCount(defaults.count);
  }, [name, image, imageAlt, count, hackathonId, addItem]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New item
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
            <Label htmlFor="count" className="text-right leading-normal">
              Count
            </Label>
            <Input
              id="count"
              type="number"
              name="count"
              placeholder="0"
              value={count}
              onChange={(event) => setCount(+event.target.value)}
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
