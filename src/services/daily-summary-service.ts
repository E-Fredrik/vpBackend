import { prismaClient } from "../utils/database-util";
import { CreateDailySummaryInput, UpdateDailySummaryInput, DailySummary, DailySummaryQueryParams } from "../models/dailySummaryModel";
import { NotFoundError } from "../error/response-error";
import { DailySummaryValidation } from "../validations/daily-summary-validation";

export class DailySummaryService {
  static async create(data: CreateDailySummaryInput): Promise<DailySummary> {
    const validatedData = DailySummaryValidation.CREATE.parse(data);
    
    return await prismaClient.daily_Summary.create({
      data: validatedData
    });
  }

  static async getAll(): Promise<DailySummary[]> {
    return await prismaClient.daily_Summary.findMany({
      orderBy: { date: 'desc' }
    });
  }

  static async getById(id: number): Promise<DailySummary> {
    const summary = await prismaClient.daily_Summary.findUnique({
      where: { summary_id: id }
    });

    if (!summary) {
      throw new NotFoundError("Daily summary");
    }

    return summary;
  }

  static async getByUser(userId: number, query?: DailySummaryQueryParams): Promise<DailySummary[]> {
    return await prismaClient.daily_Summary.findMany({
      where: {
        user_id: userId,
        date: {
          gte: query?.startDate,
          lte: query?.endDate
        }
      },
      orderBy: { date: 'desc' }
    });
  }

  static async update(id: number, data: Omit<UpdateDailySummaryInput, 'summary_id'>): Promise<DailySummary> {
    const validatedData = DailySummaryValidation.UPDATE.parse(data);
    
    await this.getById(id);

    return await prismaClient.daily_Summary.update({
      where: { summary_id: id },
      data: validatedData
    });
  }

  static async delete(id: number): Promise<void> {
    await this.getById(id);
    
    await prismaClient.daily_Summary.delete({
      where: { summary_id: id }
    });
  }
}
