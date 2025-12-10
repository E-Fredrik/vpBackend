import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const user1 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      bmiGoal: 22.5,
      height: 175,
      weight: 70.5,
      gender: "MALE",
      birthDate: new Date("1990-01-15"),
      healthCondition: "DIABETES"
    }
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Jane Smith",
      email: "jane@example.com",
      bmiGoal: 21.0,
      height: 165,
      weight: 60.0,
      gender: "FEMALE",
      birthDate: new Date("1995-05-20")
    }
  });

  // Create a place
  const place = await prisma.place_of_Interest.create({
    data: {
      name: "Central Park Gym",
      category: "GYM",
      latitude: 40.7829,
      longitude: -73.9654,
      geofenceRadius: 100
    }
  });

  // Create a food log (use number instead of BigInt)
  const currentTimestamp = Date.now();
  await prisma.food_Log.create({
    data: {
      user_id: user1.user_id,
      foodName: "Salad",
      calories: 250,
      timestamp: currentTimestamp as any,
      latitude: 40.7128,
      longitude: -74.0060
    }
  });

  console.log("Seed data created successfully!");
  console.log({ user1, user2, place });
}

main()
  .catch((e: any) => {
    console.error(e);
  })
  .then(async () => {
    await prisma.$disconnect();
  });
