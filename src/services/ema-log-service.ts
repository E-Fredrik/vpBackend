import { prismaClient } from "../utils/database-util";
import { CreateEMALogInput, UpdateEMALogInput, EMALog, EMALogQueryParams } from "../models/emaLogModel";
import { NotFoundError } from "../error/response-error";
import { EMALogValidation } from "../validations/ema-log-validation";

export class EMALogService {
  static async create(data: CreateEMALogInput): Promise<EMALog> {
    const validatedData = EMALogValidation.CREATE.parse(data);
    
    return await prismaClient.eMA_Log.create({
      data: validatedData
    });
  }

  static async getAll(): Promise<EMALog[]> {
    return await prismaClient.eMA_Log.findMany({
      orderBy: { timestamp: 'desc' }
    });
  }

  static async getById(id: number): Promise<EMALog> {
    const log = await prismaClient.eMA_Log.findUnique({
      where: { ema_id: id }
    });

    if (!log) {
      throw new NotFoundError("EMA log");
    }

    return log;
  }

  static async getByUser(userId: number, query?: EMALogQueryParams): Promise<EMALog[]> {
    return await prismaClient.eMA_Log.findMany({
      where: {
        user_id: userId,
        timestamp: {
          gte: query?.startTime,
          lte: query?.endTime
        }
      },
      orderBy: { timestamp: 'desc' }
    });
  }

  static async update(id: number, data: Omit<UpdateEMALogInput, 'ema_id'>): Promise<EMALog> {
    const validatedData = EMALogValidation.UPDATE.parse(data);
    
    await this.getById(id);

    return await prismaClient.eMA_Log.update({
      where: { ema_id: id },
      data: validatedData
    });
  }

  static async delete(id: number): Promise<void> {
    await this.getById(id);
    
    await prismaClient.eMA_Log.delete({
      where: { ema_id: id }
    });
  }
}
