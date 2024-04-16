import { Router } from "express";
import {
  addAdminToOrganisme,
  createOrganisme,
  followOrganisme,
  getOrganisme,
  getOrganismes,
  unFollowOrganisme,
  updateOrganimseAvatar,
  updateOrganimseInfo,
} from "../controllers/organismeController";

const organismeRouter = Router();

organismeRouter.post("/organisme", createOrganisme);
organismeRouter.put("/organisme_avatar/:id", updateOrganimseAvatar);
organismeRouter.put("/organisme_inforamtion/:id", updateOrganimseInfo);
organismeRouter.put("/admin_organisme/:id", addAdminToOrganisme);
organismeRouter.put("/follow_organisme/:id", followOrganisme);
organismeRouter.put("/unfollow_organisme/:id", unFollowOrganisme);
organismeRouter.get("/organisme/:id", getOrganisme);
organismeRouter.get("/organismes/:id", getOrganismes);

export default organismeRouter;
