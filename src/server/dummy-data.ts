import { type Hackathon } from "@prisma/client";
import { type item } from "~/types";

export const _hackathons: Hackathon[] = [
  {
    id: "id",
    name: "HackNYU",
    url: "https://www.hacknyu.org/",
    banner:
      "https://s3.amazonaws.com/assets.mlh.io/events/splashes/000/212/494/thumb/Event_Backsplash.png?1673562402",
    logo: "https://s3.amazonaws.com/assets.mlh.io/events/logos/000/212/494/thumb/Event_Logo.png",
    date: "Feb 18th - 19th",
    city: "Brooklyn",
    state: "NY",
  },
];

export const _items: item[] = [
  {
    id: 1,
    name: "Arduino Uno",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    imageAlt: "Arduino Uno R3",
    count: 4,
  },
];
