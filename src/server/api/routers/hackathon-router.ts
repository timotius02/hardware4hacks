import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const hackathonRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.hackathon.findMany();
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

  getAllItemsInCart: protectedProcedure.query(({ ctx }) => {
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
});
