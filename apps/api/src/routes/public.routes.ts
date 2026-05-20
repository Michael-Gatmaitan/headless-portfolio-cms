import { Router } from "express";
import { authenticateApiKey } from "../middleware/apiKey.middleware";
import * as SkillService from "../services/skill.service";
import * as ProjectService from "../services/project.service";
import * as AwardService from "../services/award.service";
import type { AuthRequest } from "../middleware/auth.middleware";
import type { Response } from "express";

const router = Router();

router.use(authenticateApiKey);

router.get("/", async (req: AuthRequest, res: Response) => {
  const projects = await ProjectService.listProjects(req.userId!);
  const awards = await AwardService.listAwards(req.userId!);
  const skills = await SkillService.listSkills(req.userId!);

  res.json({ success: true, data: { projects, awards, skills } });
});

router.get("/projects", async (req: AuthRequest, res: Response) => {
  const projects = await ProjectService.listProjects(req.userId!);
  res.json({ success: true, data: projects });
});

router.get("/projects/:id", async (req: AuthRequest, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const project = await ProjectService.getProject(req.userId!, id);
  if (!project) {
    res.status(404).json({ success: false, error: "Not found" });
    return;
  }
  res.json({ success: true, data: project });
});

router.get("/skills", async (req: AuthRequest, res: Response) => {
  const skills = await SkillService.listSkills(req.userId!);
  res.json({ success: true, data: skills });
});

router.get("/skills/:id", async (req: AuthRequest, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const skill = await SkillService.getSkill(req.userId!, id);
  if (!skill) {
    res.status(404).json({ success: false, error: "Not found" });
    return;
  }
  res.json({ success: true, data: skill });
});

router.get("/awards", async (req: AuthRequest, res: Response) => {
  const awards = await AwardService.listAwards(req.userId!);
  res.json({ success: true, data: awards });
});

router.get("/awards/:id", async (req: AuthRequest, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const award = await AwardService.getAward(req.userId!, id);
  if (!award) {
    res.status(404).json({ success: false, error: "Not found" });
    return;
  }
  res.json({ success: true, data: award });
});

export default router;
