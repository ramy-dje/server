import { Response, Request } from "express";
import ErrorHandler from "../ErrorHandler";
import cloudinary from "cloudinary";
import Organisme, { IOrganisme } from "../models/organismeModel";
import { makeNotifiaction } from "./notificationController";
import User from "../models/userModel";

// export const createOrganisme = async (req: Request, res: Response) => {
//   try {
//     const { name, position, avatar } = req.body;

//     if (avatar) {
//       console.log("avatars");
//       const Mycloud = await cloudinary.v2.uploader.upload(avatar, {
//         folder: "avas",
//         width: 150,
//       });
//       (avatar as any).public_id = Mycloud.public_id;
//       (avatar as any).url = Mycloud.url;
//       console.log("MyCloud ", Mycloud);
//     }
//     const organisme = await Organisme.create({
//       name,
//       position,
//       avatar,
//       admins: [(req as any).user._id],
//     });
//     if (!organisme) {
//       throw new Error("Organisme not created");
//     }
//     res.status(200).json({
//       success: true,
//       organisme,
//     });
//   } catch (err) {
//     ErrorHandler(err, 400, res);
//   }
// };

export const createOrganisme = async (req: Request, res: Response) => {
  try {
    const { name, position, avatar } = req.body;
    let avatarDetails = {};
    if (avatar) {
      const Mycloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
        width: 150,
      });
      (avatarDetails as any).public_id = Mycloud.public_id;
      (avatarDetails as any).url = Mycloud.url;
    }
    const organisme = await Organisme.create({
      name,
      position,
      avatar: avatar ? avatarDetails : null, // Assign avatar details object to avatar property
      admins: [(req as any).user._id],
    });
    if (!organisme) {
      throw new Error("Organisme not created");
    }
    res.status(200).json({
      success: true,
      organisme,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const updateOrganimseAvatar = async (req: Request, res: Response) => {
  try {
    const { avatar } = req.body;
    if (!avatar) {
      throw new Error("You must provide an avatar");
    }
    const organisme = (await Organisme.findById(req.params.id)) as IOrganisme;
    if (!organisme) {
      throw new Error("Organisme not found");
    }
    const admin = organisme.admins.find(
      (admin) => admin == (req as any).user._id
    );
    if (!admin) {
      throw new Error(
        "You dont have the authorization to do this , you are not an admin in this groupe"
      );
    }
    if (organisme.avatar.public_id) {
      await cloudinary.v2.uploader.destroy(organisme.avatar.public_id);
    }
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
      width: 150,
    });
    organisme.avatar.public_id = myCloud.public_id;
    organisme.avatar.url = myCloud.url;
    await organisme.save();
    const content = `the admin ${
      ((req as any).user.firstName, " ", (req as any).user.lastName)
    } has successfully change The avatare of the groupe`;
    for (const admin of organisme.admins) {
      await makeNotifiaction(admin, content);
    }
    res.status(200).json({
      success: true,
      organisme,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const updateOrganimseInfo = async (req: Request, res: Response) => {
  try {
    const { name, position } = req.body;
    const organisme = (await Organisme.findById(req.params.id)) as IOrganisme;
    if (!organisme) {
      throw new Error("Organisme not found");
    }
    const admin = organisme.admins.find(
      (admin) => admin == (req as any).user._id
    );
    if (!admin) {
      throw new Error(
        "You dont have the authorization to do this , you are not an admin in this page"
      );
    }
    let content = `the admin ${
      ((req as any).user.firstName, " ", (req as any).user.lastName)
    } has successfully change information about the group,`;
    if (name) {
      organisme.name = name;
      content += ` The name of the group to ${name}`;
    }
    if (position) {
      organisme.position = position;
      content += ` And the position of the group to ${position}`;
    }
    await organisme.save();
    res.status(200).json({
      success: true,
      organisme,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const addAdminToOrganisme = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const organisme = (await Organisme.findById(req.params.id)) as IOrganisme;
    if (!organisme) {
      throw new Error("Organisme not found");
    }
    const admin = organisme.admins.find(
      (admin) => admin == (req as any).user._id
    );
    if (!admin) {
      throw new Error(
        "You dont have the authorization to do this , you are not an admin in this page"
      );
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("the User you provide is not available");
    }
    organisme.admins.push(user._id);
    await organisme.save();
    res.status(200).json({
      success: true,
      organisme,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const followOrganisme = async (req: Request, res: Response) => {
  try {
    const organisme = (await Organisme.findById(req.params.id)) as IOrganisme;
    if (!organisme) {
      throw new Error("Organisme not found");
    }
    const index = organisme.followers.findIndex(
      (follower) => follower == (req as any).user._id
    );
    if (index !== -1) {
      throw new Error("You have already followed this organization");
    }
    organisme.followers.push((req as any).user._id);
    await organisme.save();
    res.status(200).json({
      success: true,
      organisme,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const unFollowOrganisme = async (req: Request, res: Response) => {
  try {
    const organisme = (await Organisme.findById(req.params.id)) as IOrganisme;
    if (!organisme) {
      throw new Error("Organisme not found");
    }
    const index = organisme.followers.findIndex(
      (follower) => follower == (req as any).user._id
    );
    if (index === -1) {
      throw new Error("You are not followed this organization");
    }
    organisme.followers.splice(index, 1);
    await organisme.save();
    res.status(200).json({
      success: true,
      organisme,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getOrganisme = async (req: Request, res: Response) => {
  try {
    const organisme = await Organisme.findById(req.params.id);
    if (!organisme) {
      throw new Error("Organisme not found");
    }
    res.status(200).json({
      success: true,
      organisme,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getOrganismes = async (req: Request, res: Response) => {
  try {
    const limit = req.body.limit;
    const skip = (+req.params.id - 1) * limit;
    const organismes = await Organisme.find().skip(skip).limit(limit);
    if (organismes.length === 0) {
      throw new Error("That is all the Organismes we have");
    }
    res.status(200).json({
      success: true,
      organismes,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};
