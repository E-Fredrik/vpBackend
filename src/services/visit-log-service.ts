import { prismaClient } from "../utils/database-util";
import { CreateVisitLogInput, UpdateVisitLogInput, VisitLog, VisitLogQueryParams } from "../models/visitLogModel";
import { NotFoundError } from "../error/response-error";
import { VisitLogValidation } from "../validations/visit-log-validation";

export class VisitLogService {
  static async create(data: CreateVisitLogInput): Promise<VisitLog> {
    const validatedData = VisitLogValidation.CREATE.parse(data);
    
    return await prismaClient.visit_Log.create({
      data: validatedData
    });
  }

  static async getAll(): Promise<VisitLog[]> {
    return await prismaClient.visit_Log.findMany({
      orderBy: { entryTime: 'desc' }
    });
  }

  static async getById(id: number): Promise<VisitLog> {
    const log = await prismaClient.visit_Log.findUnique({
      where: { visit_id: id },
      include: {
        user: { select: { user_id: true, name: true, email: true } },
        place: { select: { place_id: true, name: true, category: true, latitude: true, longitude: true } }
      }
    });

    if (!log) {
      throw new NotFoundError("Visit log");
    }

    return log;
  }

  static async getByUser(userId: number, query?: VisitLogQueryParams): Promise<VisitLog[]> {
    return await prismaClient.visit_Log.findMany({
      where: {
        user_id: userId,
        place_id: query?.place_id,
        entryTime: {
          gte: query?.startTime
        },
        exitTime: {
          lte: query?.endTime
        }
      },
      include: {
        place: { select: { place_id: true, name: true, category: true } }
      },
      orderBy: { entryTime: 'desc' }
    });
  }

  static async getByPlace(placeId: number): Promise<VisitLog[]> {
    return await prismaClient.visit_Log.findMany({
      where: { place_id: placeId },
      include: {
        user: { select: { user_id: true, name: true } }
      },
      orderBy: { entryTime: 'desc' }
    });
  }

  static async update(id: number, data: Omit<UpdateVisitLogInput, 'visit_id'>): Promise<VisitLog> {
    const validatedData = VisitLogValidation.UPDATE.parse(data);
    
    await this.getById(id);

    return await prismaClient.visit_Log.update({
      where: { visit_id: id },
      data: validatedData
    });
  }

  static async delete(id: number): Promise<void> {
    await this.getById(id);
    
    await prismaClient.visit_Log.delete({
      where: { visit_id: id }
    });
  }
}
