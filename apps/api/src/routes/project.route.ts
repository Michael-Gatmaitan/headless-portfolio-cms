import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import * as ProjectController from "../controllers/project.controller";

const router = Router();

router.use(authenticate);

router.get("/", ProjectController.list);
router.put("/reorder", ProjectController.reorder);
router.get("/:id", ProjectController.get);
router.post("/", ProjectController.create);
router.put("/:id", ProjectController.update);
router.delete("/:id", ProjectController.remove);

// router.put("/:id/upload-thumbnail", ProjectController.uploadThumbnail);

export default router;
