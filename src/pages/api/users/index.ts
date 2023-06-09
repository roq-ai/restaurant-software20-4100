import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { usersValidationSchema } from 'validationSchema/users';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getUsers();
    case 'POST':
      return createUsers();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getUsers() {
    const data = await prisma.users.findMany({});
    return res.status(200).json(data);
  }

  async function createUsers() {
    await usersValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.notifications?.length > 0) {
      const create_notifications = body.notifications;
      body.notifications = {
        create: create_notifications,
      };
    } else {
      delete body.notifications;
    }
    if (body?.orders?.length > 0) {
      const create_orders = body.orders;
      body.orders = {
        create: create_orders,
      };
    } else {
      delete body.orders;
    }
    if (body?.reservations?.length > 0) {
      const create_reservations = body.reservations;
      body.reservations = {
        create: create_reservations,
      };
    } else {
      delete body.reservations;
    }
    if (body?.restaurants?.length > 0) {
      const create_restaurants = body.restaurants;
      body.restaurants = {
        create: create_restaurants,
      };
    } else {
      delete body.restaurants;
    }
    if (body?.staff?.length > 0) {
      const create_staff = body.staff;
      body.staff = {
        create: create_staff,
      };
    } else {
      delete body.staff;
    }
    const data = await prisma.users.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
