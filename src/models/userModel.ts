// User-related enums and interfaces
import { Gender as PrismaGender, HealthCondition as PrismaHealthCondition } from "../../generated/prisma";

export type Gender = PrismaGender;
export const Gender = PrismaGender;

export type HealthCondition = PrismaHealthCondition;
export const HealthCondition = PrismaHealthCondition;

// Main User interface matching Prisma schema
export interface User {
  user_id: number;
  name: string | null;
  bmiGoal: number | null;
  height: number | null;
  healthCondition: HealthCondition | null;
  weight: number | null;
  email: string | null;
  birthDate: Date | null;
  gender: Gender | null;
}

// Interface for creating a new user
export interface CreateUserInput {
  name?: string;
  bmiGoal?: number;
  height?: number;
  healthCondition?: HealthCondition;
  weight?: number;
  email?: string;
  birthDate?: Date;
  gender?: Gender;
}

// Interface for updating an existing user
export interface UpdateUserInput extends Partial<CreateUserInput> {
  user_id: number;
}

// Interface for user query parameters
export interface UserQueryParams {
  user_id?: number;
  email?: string;
  gender?: Gender;
  healthCondition?: HealthCondition;
}

// Interface for user response (can exclude sensitive fields if needed)
export interface UserResponse extends Omit<User, 'email'> {
  email?: string;
}
