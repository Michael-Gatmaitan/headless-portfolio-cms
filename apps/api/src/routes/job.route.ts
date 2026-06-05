import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import * as JobController from "../controllers/job.controller";

const router = Router();

router.use(authenticate);

router.get("/", JobController.list);
router.get("/:id", JobController.get);
router.post("/", JobController.create);
router.put("/:id", JobController.update);
router.delete("/:id", JobController.remove);

export const jobRoutes = router;
