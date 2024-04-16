import { Response, Request } from "express";
import ErrorHandler from "../ErrorHandler";
import Plant, { IPlant } from "../models/plantModel";
import Purchase from "../models/purchaseModel";
import { makeNotifiaction } from "./notificationController";
require("dotenv").config();

export const createPurchase = async (req: Request, res: Response) => {
  try {
    const { purchases } = req.body;
    console.log(purchases)
    const user = (req as any).user;
    let arr = [];
    let result = [];
    for (const purchase of purchases) {
      const plant = (await Plant.findById(purchase.plantId).select(
        "_id owner price quantity name"
      )) as IPlant;
      if (!plant) {
        throw new Error(`this plant is not available`);
      }
      if (plant.quantity > purchase.quantity) {
        arr.push({
          plantId: plant._id,
          sellerId: plant.owner,
          quantity: purchase.quantity,
          price: plant.price,
        });
        plant.quantity  = plant.quantity - purchase.quantity ;
        if (plant.quantity < ( Number(process.env.MIN_QUANTITY)  || 2)) {
          const content = `The amount of this plant : ${plant.name} you have is small ,You have only ${plant.quantity} pieces `;
          await makeNotifiaction(plant.owner, content);
        }
        const content = `The client ${
          (user?.firstName, " ", user?.lastName)
        } is requesting ${purchase.quantity} plants of ${plant.name}`;
        await makeNotifiaction(plant.owner, content);
        await plant.save();
      } else {
        result.push(
          `Sory we dont this quantity ${purchase.quantity} the plant ${plant.name} ,we have only ${plant.quantity}`
        );
      }
    }
    if (arr.length === 0) {
      throw new Error("We dont have this plant,we are sorry");
    }
    const pur = {
      purchases: arr,
      clientId: user._id,
    };
    
    const purchase = await Purchase.create(pur);
    if (!purchase) {
      throw new Error("Purchse does not complete");
    }
    res.status(200).json({ success: true, purchase, result });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getPurchases = async (req: Request, res: Response) => {
  try {
    const purchases = await Purchase.find().populate([
      {
        path: "purchases.sellerId",
        select: "firstName lastName avatar",
      },
      {
        path: "clientId",
        select: "firstName lastName avatar",
      },
      {
        path: "purchases.plantId",
        select: "name",
      },
    ]);
    res.status(200).json({ success: true, purchases });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getClientPurchases = async (req: Request, res: Response) => {
  try {
    const purchases = await Purchase.find({
      clientId: (req as any).user._id,
    }).populate([
      {
        path: "purchases.sellerId",
        select: "firstName lastName avatar",
      },
      {
        path: "clientId",
        select: "firstName lastName avatar",
      },
      {
        path: "purchases.plantId",
        select: "name image",
      },
    ]);
    res.status(200).json({ success: true, purchases });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getSellerPurchaes = async (req: Request, res: Response) => {
  try {
    const purchases = await Purchase.find({
      "purchases.sellerId": (req as any).user._id,
    }).populate([
      {
        path: "purchases.plantId",
        select: "name",
      },
    ]);
    const sellerPurchases = purchases.map((purchase) => {
      return {
        _id: purchase._id,
        purchases: purchase.purchases.filter(
          (p) => p.sellerId.toString() === (req as any).user._id
        ),
        clientId: purchase.clientId,
        date: purchase.date,
      };
    });
    res.status(200).json({ success: true, purchases: sellerPurchases });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};
