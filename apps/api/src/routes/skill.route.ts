import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import * as SkillController from "../controllers/skill.controller";

const router = Router();

router.use(authenticate);

router.get("/", SkillController.list);
router.get("/:id", SkillController.get);
router.post("/", SkillController.create);
router.put("/:id", SkillController.update);
router.delete("/:id", SkillController.remove);

export default router;
