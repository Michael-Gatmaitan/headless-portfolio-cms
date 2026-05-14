export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  thumbnail: string | undefined;
  url: string;
  github: string;
  dateRange: string;
}

export interface Skill {
  id: string;
  userId: string;
  title: string;
  tags: string[];
}

export interface Award {
  id: string;
  userId: string;
  title: string;
  thumbnail: string | undefined;
  shortDescription: string;
  longDescription: string;
  year: string;
  tags: string[];
}

// Input Types
export interface CreateProjectInput {
  title: string;
  description: string;
  url: string;
  github: string;
  dateRange: string;
}

export interface CreateSkillInput {
  title: string;
  tags: string[];
}

export interface CreateAwardInput {
  title: string;
  shortDescription: string;
  longDescription: string;
  year: string;
  tags: string[];
}

// Auth Types
export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
