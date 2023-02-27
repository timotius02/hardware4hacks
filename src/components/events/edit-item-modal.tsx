import { type Item } from "@prisma/client";
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

interface EditItemModalProps {
  item: Item;
}
export default function EditItemModal(props: EditItemModalProps) {
  const { item } = props;
  const [name, setName] = useState(item.name);
  const [image, setImageLink] = useState(item.image);
  const [imageAlt, setImageAlt] = useState(item.imageAlt);
  const [count, setCount] = useState(item.count);

  const [open, setOpen] = useState(false);

  const utils = api.useContext();

  const router = useRouter();
  const { eventId } = router.query;

  const editItem = api.hackathon.editItem.useMutation({
    // Optimistic Update
    onMutate: async (newItem) => {
      await utils.hackathon.getAllItems.cancel();
      const previousItems = utils.hackathon.getAllItems.getData(hackathonId);
      const newItems = previousItems?.map((item) =>
        item.id === newItem.id ? { ...newItem, hackathonId } : item
      );
      utils.hackathon.getAllItems.setData(hackathonId, newItems);
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

  const removeItem = api.hackathon.removeItem.useMutation({
    // Optimistic Update
    onMutate: async (id) => {
      await utils.hackathon.getAllItems.cancel();
      const previousItems = utils.hackathon.getAllItems.getData(hackathonId);
      const newItems = previousItems?.filter((item) => item.id !== id);
      utils.hackathon.getAllItems.setData(hackathonId, newItems);
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

  const handleSubmit = useCallback(() => {
    editItem.mutate({
      id: item.id,
      name,
      image,
      imageAlt,
      count,
    });
    setOpen(false);
  }, [item, name, image, imageAlt, count, editItem]);

  const handleRemove = useCallback(() => {
    removeItem.mutate(item.id);
    setOpen(false);
  }, [item, removeItem]);

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
