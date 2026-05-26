import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import * as AwardsController from "../controllers/awards.controller";

const router = Router();

router.use(authenticate);

router.get("/", AwardsController.list);
router.put("/reorder", AwardsController.reorder);
router.get("/:id", AwardsController.get);
router.post("/", AwardsController.create);
router.put("/:id", AwardsController.update);
router.delete("/:id", AwardsController.remove);

export default router;
