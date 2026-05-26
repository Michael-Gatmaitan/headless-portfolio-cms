import { Request, Response } from "express";
import { loginSchema, signupSchema } from "../schemas/authSchema";
import { z } from "zod";
import * as AuthService from "../services/auth.service";

export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const data = signupSchema.parse(req.body);
    const result = await AuthService.signupUser(data);
    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    if (err.name === "ZodError") {
      res
        .status(400)
        .json({
          success: false,
          error: "Validation failed",
          details: err.flatten().fieldErrors,
        });
      return;
    }
    if (err.message === "An account with this email already exists") {
      res.status(409).json({ success: false, error: err.message });
      return;
    }
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const data = loginSchema.parse(req.body);
    const result = await AuthService.loginUser(data);
    res.json({ success: true, data: result });
  } catch (err: any) {
    if (err.name === "ZodError") {
      res
        .status(400)
        .json({
          success: false,
          error: "Validation failed",
          details: err.flatten().fieldErrors,
        });
      return;
    }
    res.status(401).json({ success: false, error: err.message });
  }
}

const googleLoginSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(1, "Name is required"),
});

export async function googleLogin(req: Request, res: Response): Promise<void> {
  try {
    const data = googleLoginSchema.parse(req.body);
    const result = await AuthService.loginWithGoogle(data);
    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    if (err.name === "ZodError") {
      res
        .status(400)
        .json({
          success: false,
          error: "Validation failed",
          details: err.flatten().fieldErrors,
        });
      return;
    }
    res.status(401).json({ success: false, error: err.message });
  }
}
