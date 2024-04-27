import Plant, { IPlant } from "../models/plantModel";
import { Response, Request, NextFunction } from "express";
import ErrorHandler from "../ErrorHandler";
import { makeNotifiaction } from "./notificationController";
import cloudinary from "cloudinary";

export const addPlant = async (req: Request, res: Response) => {
  try {
    const { name, description, price, images, quantity,image }: IPlant = req.body;
    let ArrImages: { public_id: string; url: string }[] = [];
    const myCloud = await cloudinary.v2.uploader.upload(image.toString(), {
      folder: "avatars",
      width: 150,
    });
   
    if (images.length > 0) {
      for (const image of images) {
        const myCloud = await cloudinary.v2.uploader.upload(image.toString(), {
          folder: "avatars",
          width: 150,
        });
        ArrImages.push({
          public_id: myCloud.public_id,
          url: myCloud.url,
        });
      }
    }
   
    const plant: IPlant = await Plant.create({
      name,
      description,
      price,
      owner: (req as any).user._id,
      quantity,
      image : {
        public_id : myCloud.public_id ,
        url : myCloud.url
      },
      images: ArrImages,
    });
    res.status(200).json({ success: true, plant });
  } catch (e) {
    ErrorHandler(e, 400, res);
  }
};

export const getPlants = async (req: Request, res: Response) => {
  try {
    const limit = req.body.limit;
    const plants = await Plant.find()
      .populate([
        {
          path: "owner",
          select: "fisrtName lastName avatar",
        },
        {
          path: "reviews.userId",
          select: "fisrtName lastName avatar",
        },
      ])
      .limit(limit)
      .skip((parseInt(req.params.id) - 1) * parseInt(limit));
    res.status(200).json({ success: true, plants });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getPlant = async (req: Request, res: Response) => {
  try {
    const plant = await Plant.findById(req.params.id).populate([
      {
        path: "owner",
        select: "_id firstName lastName avatar",
      },
      {
        path: "reviews.userId",
        select: "firstName lastName avatar location",
      },
    ]);
    res.status(200).json({ success: true, plant });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getPlantBySeller= async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    console.log((req as any).user)
    const plants = await Plant.find({owner:user._id}).select('-images');
    res.status(200).json({ success: true, plants });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};
export const getPlantsByName= async (req: Request, res: Response) => {
  try {
    const searchText = req.params.name;
    const plants = await Plant.find({ name: { $regex: searchText, $options: 'i' } }).select(['-images','-likes','-reviews']);
    res.status(200).json({ success: true, plants });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const updatePlant = async (req: Request, res: Response) => {
  try {
    const {name,description,price,owner,quantity,image,images} = req.body;
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      throw new Error("This plant is not available ");
    }
    if (plant?.owner != (req as any).user._id) {
      throw new Error("This plant is not yours ,you can't update it ");
    }
    const newPlant = await Plant.findByIdAndUpdate(
      req.params.id,
      {name,description,price,owner,quantity,image,images},
      {
        new: true,
      }
    );
    if (!newPlant) {
      throw new Error("We Have a Problem , the plant does not update");
    }
    res.status(200).json({ success: true, plant: newPlant });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const removeReviewPlant = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.body;
    const plant = await Plant.findById(req.params.id);
    const index = plant?.reviews.findIndex(
      (rev) => (rev as any)._id == reviewId
    ) as number;
    if (index != -1) {
      plant?.reviews.splice(index, 1);
      plant?.save();
    } else {
      throw new Error("The review is not available");
    }
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const addReviewPlant = async (req: Request, res: Response) => {
  try {
    const { review } = req.body;
    const user = (req as any).user;
    const plant = await Plant.findById(req.params.id).populate([
      {
        path: "owner",
        select: "firstName lastName avatar",
      },
      {
        path: "reviews.userId",
        select: "firstName lastName avatar",
      },
    ]);
    if (!plant) {
      throw new Error("id Plant does not exist");
    }
    const isPurschased = plant.purschased.find((id) => id == user._id);
    if (!isPurschased) {
      throw new Error("You have to buy this Plant to add a review");
    }
    const isReviewBefore = plant.reviews.find(
      (rev) => (rev as any).userId == user._id
    );
    console.log("i want here");
    if (isReviewBefore) {
      throw new Error("You have already review this plant");
    }
    plant.reviews.push({
      userId: user._id,
      review,
      likes: [],
    });
    const content = `${user.firstName} ${user.lastName} review your plant: ${plant.name}`;
    await makeNotifiaction(plant.owner, content);
    await plant.save();
    res.status(200).json({ success: true, plant });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const likePlant = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      throw new Error("id Plant does not exist");
    }
    const index = plant.likes.findIndex((id) => id == user._id);
    if (index == -1) {
      plant.likes.push(user._id);
      const content = `${user.firstName} ${user.lastName} like your plant: ${plant.name}`;
      await makeNotifiaction(plant.owner, content);
    } else {
      plant.likes.splice(index, 1);
    }
    await plant.save();
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const removePlant = async (req: Request, res: Response) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      throw new Error("This plant is not available ");
    }
    if (plant?.owner != (req as any).user._id) {
      throw new Error("This plant is not yours ,you can't update it ");
    }
    await Plant.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const likeReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.body;
    const user = (req as any).user;
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      throw new Error("id Plant does not exist");
    }
    const review = plant.reviews.find((rev) => (rev as any)._id == reviewId);
    if (!review) {
      throw new Error("this review is not available");
    }
    const index = review.likes.findIndex((id) => id == user._id);
    if (index == -1) {
      review.likes.push(user._id);
      const content = `${user.firstName} ${user.lastName} review your plant: ${plant.name}`;
      await makeNotifiaction(review.userId, content);
    } else {
      review.likes.splice(index, 1);
    }
    await plant.save();
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const changeQuantityPlant = async (req: Request, res: Response) => {
  try {
    const quantity = req.body.quantity;
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      throw new Error("This plant is not available ");
    }
    if (plant?.owner != (req as any).user._id) {
      throw new Error("This plant is not yours ,you can't update it ");
    }
    await Plant.findByIdAndUpdate(req.params.id, { quantity }, { new: true });
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const changePriceOfPlant = async (req: Request, res: Response) => {
  try {
    const price = req.body.price;
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      throw new Error("This plant is not available ");
    }
    if (plant?.owner != (req as any).user._id) {
      throw new Error("This plant is not yours ,you can't update it ");
    }
    const newPlant = await Plant.findByIdAndUpdate(
      req.params.id,
      { price },
      { new: true }
    );
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getSellerPlants = async (req: Request, res: Response) => {
  try {
    const plants = await Plant.find({
      owner: (req as any).user._id,
    });
    if (plants.length === 0) {
      throw new Error("You don't have any plant");
    }
    res.status(200).json({ success: true, plants });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const { reviewId, newReview } = req.body;
    const user = (req as any).user;
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      throw new Error("id Plant does not exist");
    }
    const review = plant.reviews.find((rev) => (rev as any)._id == reviewId);
    if (!review) {
      throw new Error("this review is not available");
    }
    if (review.userId != user._id)
      throw new Error("This is note your comment you can't updated");
    review.review = newReview;
    await plant.save();
    const content = `${user.firstName} ${user.lastName} update his review about your plant: ${plant.name}`;
    await makeNotifiaction(plant.owner, content);
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};
