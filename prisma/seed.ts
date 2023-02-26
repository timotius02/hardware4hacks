import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const hackNYU = await prisma.hackathon.create({
    data: {
      name: "HackNYU",
      url: "https://www.hacknyu.org/",
      banner:
        "https://s3.amazonaws.com/assets.mlh.io/events/splashes/000/212/494/thumb/Event_Backsplash.png?1673562402",
      logo: "https://s3.amazonaws.com/assets.mlh.io/events/logos/000/212/494/thumb/Event_Logo.png",
      date: "Feb 18th - 19th",
      city: "Brooklyn",
      state: "NY",
      items: {
        create: [
          {
            name: "Arduino Uno",
            image:
              "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
            imageAlt: "Arduino Uno R3",
            count: 4,
          },
        ],
      },
      reservable: {
        create: [
          {
            name: "Meta Quest 2",
            image:
              "https://thumbs.dreamstime.com/b/oculus-quest-virtual-reality-headset-chester-england-october-199070646.jpg",
            imageAlt: "Meta Quest 2",
            date: "",
            startTime: "18:00",
            endTime: "22:00",
            timeInterval: 60,
          },
        ],
      },
    },
  });
  console.log(hackNYU);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
