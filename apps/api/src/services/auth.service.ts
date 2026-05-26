import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/user.model";
import { sign, verify, type SignOptions } from "jsonwebtoken";
import { AuthResponse, LoginInput, RegisterInput, User } from "@portfolio-types/shared";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;

function formatUser(user: {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function loginUser(input: LoginInput): Promise<AuthResponse> {
  const user = await findUserByEmail(input.email);
  if (!user || !user.passwordHash) {
    throw new Error("Invalid email or password");
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new Error("Invalid email or password");
  }

  const token = sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);

  return { user: formatUser(user), token };
}

export async function signupUser(input: RegisterInput): Promise<AuthResponse> {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new Error("An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await createUser({
    name: input.name,
    email: input.email,
    passwordHash,
  });

  const token = sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);

  return { user: formatUser(user), token };
}

export function verifyToken(token: string): { userId: string } {
  return verify(token, JWT_SECRET) as { userId: string };
}

export async function loginWithGoogle(input: {
  email: string;
  name: string;
}): Promise<AuthResponse> {
  console.log("Login with google");
  let user = await findUserByEmail(input.email);
  if (!user) {
    user = await createUser({
      name: input.name,
      email: input.email,
      passwordHash: null,
    });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);

  return { user: formatUser(user), token };
}
