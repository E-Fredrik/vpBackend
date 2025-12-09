import { prismaClient } from "../utils/database-util";
import { CreateActivityLogInput, UpdateActivityLogInput, ActivityLog, ActivityLogQueryParams } from "../models/activityRecord";
import { NotFoundError } from "../error/response-error";
import { ActivityLogValidation } from "../validations/activity-log-validation";

export class ActivityLogService {
  static async create(data: CreateActivityLogInput): Promise<ActivityLog> {
    const validatedData = ActivityLogValidation.CREATE.parse(data);
    
    return await prismaClient.activity_Log.create({
      data: validatedData
    });
  }

  static async getAll(): Promise<ActivityLog[]> {
    return await prismaClient.activity_Log.findMany({
      orderBy: { startTime: 'desc' }
    });
  }

  static async getById(id: number): Promise<ActivityLog> {
    const log = await prismaClient.activity_Log.findUnique({
      where: { activity_id: id }
    });

    if (!log) {
      throw new NotFoundError("Activity log");
    }

    return log;
  }

  static async getByUser(userId: number, query?: ActivityLogQueryParams): Promise<ActivityLog[]> {
    return await prismaClient.activity_Log.findMany({
      where: {
        user_id: userId,
        activityType: query?.activityType,
        startTime: {
          gte: query?.startTime
        },
        endTime: {
          lte: query?.endTime
        }
      },
      orderBy: { startTime: 'desc' }
    });
  }

  static async update(id: number, data: Omit<UpdateActivityLogInput, 'activity_id'>): Promise<ActivityLog> {
    const validatedData = ActivityLogValidation.UPDATE.parse(data);
    
    await this.getById(id);

    return await prismaClient.activity_Log.update({
      where: { activity_id: id },
      data: validatedData
    });
  }

  static async delete(id: number): Promise<void> {
    await this.getById(id);
    
    await prismaClient.activity_Log.delete({
      where: { activity_id: id }
    });
  }
}
