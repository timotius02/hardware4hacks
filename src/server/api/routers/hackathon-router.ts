import { z } from "zod";
import generateTimeSlots from "~/lib/generate-time-slots";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const hackathonRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.hackathon.findMany();
  }),

  getAllItemsGlobal: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.item.findMany({
      include: {
        _count: {
          select: {
            reservations: true,
          },
        },
      },
    });
  }),

  getAllItems: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.item.findMany({
      where: {
        hackathonId: input,
      },
    });
  }),

  addItem: publicProcedure
    .input(
      z.object({
        name: z.string(),
        image: z.string(),
        imageAlt: z.string(),
        count: z.number(),
        hackathonId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.item.create({
        data: input,
      });
    }),
  editItem: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        image: z.string(),
        imageAlt: z.string(),
        count: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, ...rest } = input;
      return ctx.prisma.item.update({
        where: {
          id,
        },
        data: {
          ...rest,
        },
      });
    }),
  removeItem: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.item.delete({
      where: {
        id: input,
      },
    });
  }),

  getAllReservables: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.reservable.findMany({
        where: {
          hackathonId: input,
        },
      });
    }),

  addReservable: publicProcedure
    .input(
      z.object({
        name: z.string(),
        image: z.string(),
        imageAlt: z.string(),
        hackathonId: z.string(),
        date: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        timeInterval: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.reservable.create({
        data: input,
      });
    }),
  editReservable: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        image: z.string(),
        imageAlt: z.string(),
        date: z.string(), // should validate
        startTime: z.string(), // should validate
        endTime: z.string(), //shoudl validate
        timeInterval: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, ...rest } = input;
      return ctx.prisma.reservable.update({
        where: {
          id,
        },
        data: {
          ...rest,
        },
      });
    }),
  removeReservable: publicProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.reservable.delete({
        where: {
          id: input,
        },
      });
    }),

  getItemsInCart: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.itemsInCarts.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        item: true,
      },
    });
  }),

  addItemToCart: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        quantity: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.itemsInCarts.upsert({
        where: {
          userId_itemId: {
            userId: ctx.session.user.id,
            itemId: input.itemId,
          },
        },
        update: {
          quantity: input.quantity,
        },
        create: {
          userId: ctx.session.user.id,
          itemId: input.itemId,
          quantity: input.quantity,
        },
      });
    }),
  removeItemFromCart: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.itemsInCarts.delete({
        where: {
          userId_itemId: {
            userId: ctx.session.user.id,
            itemId: input,
          },
        },
      });
    }),
  checkoutItems: protectedProcedure
    .input(
      z.array(
        z.object({
          itemId: z.string(),
          quantity: z.number(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const itemIds = input.map((entry) => entry.itemId);

      // Check if any are more than what we currently have
      const itemsPromise = input.map((item) => {
        return ctx.prisma.item.findFirst({
          where: {
            id: item.itemId,
          },
        });
      });
      const items = await Promise.all(itemsPromise);
      for (let i = 0; i < input.length; i++) {
        const item = items[i];
        const inputCount = input[i];
        if (item && inputCount && item.count < inputCount.quantity) {
          throw new Error(`Not enough ${item.name}`);
        }
      }

      // update items with new counts
      await Promise.all(
        input.map((item) => {
          return ctx.prisma.item.update({
            where: {
              id: item.itemId,
            },
            data: {
              count: {
                decrement: item.quantity,
              },
            },
          });
        })
      );

      // Create the reservations
      const reservationEntries = input.map((entry) => ({
        itemId: entry.itemId,
        quantity: entry.quantity,
        userId,
      }));

      await ctx.prisma.reservation.createMany({
        data: reservationEntries,
      });

      // Clean item cart
      await ctx.prisma.itemsInCarts.deleteMany({
        where: {
          userId,
          itemId: {
            in: itemIds,
          },
        },
      });
    }),

  // get waiting items for user
  getItemsWaiting: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.reservation.findMany({
      where: {
        userId: ctx.session.user.id,
        isApproved: false,
      },
      include: {
        item: true,
        user: true,
      },
    });
  }),

  getAllItemsWaiting: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.reservation.findMany({
      where: {
        isApproved: false,
      },
      include: {
        item: true,
      },
    });
  }),

  removeItemFromWaiting: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const reservation = await ctx.prisma.reservation.delete({
        where: {
          id: input,
        },
      });

      // reset the item count
      await ctx.prisma.item.update({
        where: {
          id: reservation.itemId,
        },
        data: {
          count: {
            increment: reservation.quantity,
          },
        },
      });
    }),

  approveReservation: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.reservation.update({
        where: {
          id: input,
        },
        data: {
          isApproved: true,
        },
      });
    }),

  getItemsCheckedOut: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.reservation.findMany({
      where: {
        userId: ctx.session.user.id,
        isApproved: true,
      },
      include: {
        item: true,
        user: true,
      },
    });
  }),

  returnItem: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const reservation = await ctx.prisma.reservation.delete({
        where: {
          id: input,
        },
      });

      return ctx.prisma.item.update({
        where: {
          id: reservation.itemId,
        },
        data: {
          count: {
            increment: reservation.quantity,
          },
        },
      });
    }),

  getTimeSlots: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const reservable = await ctx.prisma.reservable.findUniqueOrThrow({
        where: {
          id: input,
        },
      });
      const reservations = await ctx.prisma.reservableReservation.findMany({
        where: {
          reservableId: input,
        },
      });

      const reservationDates = reservations.map(
        (reservation) => reservation.date
      );

      const startDate = new Date(`${reservable.date}T${reservable.startTime}`);
      const endDate = new Date(`${reservable.date}T${reservable.endTime}`);
      const timeSlots = generateTimeSlots(
        startDate,
        endDate,
        reservable.timeInterval
      );

      return timeSlots.filter(
        (timeSlot) =>
          !reservationDates.find(
            (reservation) => reservation.valueOf() === timeSlot.valueOf()
          )
      );
    }),
});
