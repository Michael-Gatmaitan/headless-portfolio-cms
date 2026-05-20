import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import * as ApiKeyController from "../controllers/apiKey.controller";

const router = Router();

router.use(authenticate);

router.get("/", ApiKeyController.list);
router.post("/", ApiKeyController.create);
router.post("/bulk-revoke", ApiKeyController.bulkRevoke);
router.delete("/:id", ApiKeyController.revoke);

export default router;
