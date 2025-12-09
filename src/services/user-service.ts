import { prismaClient } from "../utils/database-util";
import { CreateUserInput, UpdateUserInput, User, UserQueryParams } from "../models/userModel";
import { NotFoundError, ConflictError } from "../error/response-error";
import { UserValidation } from "../validations/user-validation";

export class UserService {
  static async create(data: CreateUserInput): Promise<User> {
    const validatedData = UserValidation.CREATE.parse(data);
    
    if (validatedData.email) {
      const existing = await prismaClient.user.findUnique({
        where: { email: validatedData.email }
      });
      if (existing) {
        throw new ConflictError("Email already exists");
      }
    }

    return await prismaClient.user.create({
      data: validatedData
    });
  }

  static async getAll(): Promise<User[]> {
    return await prismaClient.user.findMany();
  }

  static async getById(id: number): Promise<User> {
    const user = await prismaClient.user.findUnique({
      where: { user_id: id }
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    return user;
  }

  static async update(id: number, data: Omit<UpdateUserInput, 'user_id'>): Promise<User> {
    const validatedData = UserValidation.UPDATE.parse(data);
    
    await this.getById(id); // Check if exists

    if (validatedData.email) {
      const existing = await prismaClient.user.findFirst({
        where: { 
          email: validatedData.email,
          user_id: { not: id }
        }
      });
      if (existing) {
        throw new ConflictError("Email already exists");
      }
    }

    return await prismaClient.user.update({
      where: { user_id: id },
      data: validatedData
    });
  }

  static async delete(id: number): Promise<void> {
    await this.getById(id);
    
    await prismaClient.user.delete({
      where: { user_id: id }
    });
  }

  static async search(params: UserQueryParams): Promise<User[]> {
    return await prismaClient.user.findMany({
      where: {
        user_id: params.user_id,
        email: params.email,
        gender: params.gender,
        healthCondition: params.healthCondition
      }
    });
  }
}
