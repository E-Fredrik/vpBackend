import { prismaClient } from "../utils/database-util";
import { CreatePlaceOfInterestInput, UpdatePlaceOfInterestInput, PlaceOfInterest } from "../models/placeOfInterest";
import { NotFoundError } from "../error/response-error";
import { PlaceValidation } from "../validations/place-validation";

export class PlaceService {
  static async create(data: CreatePlaceOfInterestInput): Promise<PlaceOfInterest> {
    const validatedData = PlaceValidation.CREATE.parse(data);
    
    return await prismaClient.place_of_Interest.create({
      data: validatedData
    });
  }

  static async getAll(): Promise<PlaceOfInterest[]> {
    return await prismaClient.place_of_Interest.findMany();
  }

  static async getById(id: number): Promise<PlaceOfInterest> {
    const place = await prismaClient.place_of_Interest.findUnique({
      where: { place_id: id }
    });

    if (!place) {
      throw new NotFoundError("Place");
    }

    return place;
  }

  static async getByCategory(category: string): Promise<PlaceOfInterest[]> {
    return await prismaClient.place_of_Interest.findMany({
      where: { category: category as any }
    });
  }

  static async update(id: number, data: Omit<UpdatePlaceOfInterestInput, 'place_id'>): Promise<PlaceOfInterest> {
    const validatedData = PlaceValidation.UPDATE.parse(data);
    
    await this.getById(id);

    return await prismaClient.place_of_Interest.update({
      where: { place_id: id },
      data: validatedData
    });
  }

  static async delete(id: number): Promise<void> {
    await this.getById(id);
    
    await prismaClient.place_of_Interest.delete({
      where: { place_id: id }
    });
  }
}
