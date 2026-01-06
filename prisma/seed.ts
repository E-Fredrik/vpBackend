import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Hash a common password for test users
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create test users
  const user1 = await prisma.user.create({
    data: {
      username: "johndoe",
      password: hashedPassword,
      email: "john@example.com",
      name: "John Doe",
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
      username: "janesmith",
      password: hashedPassword,
      email: "jane@example.com",
      name: "Jane Smith",
      bmiGoal: 21.0,
      height: 165,
      weight: 60.0,
      gender: "FEMALE",
      birthDate: new Date("1995-05-20"),
      healthCondition: "HYPERTENSION"
    }
  });

  console.log("✅ Created users:", { user1: user1.username, user2: user2.username });

  // Create places in Surabaya (replace the places array)
  const places = await Promise.all([
    prisma.place_of_Interest.create({
      data: {
        name: "Tunjungan Plaza Gym",
        category: "GYM",
        latitude: -7.2644,
        longitude: 112.7378,
        geofenceRadius: 100
      }
    }),
    prisma.place_of_Interest.create({
      data: {
        name: "Taman Bungkul",
        category: "PARK",
        latitude: -7.2894,
        longitude: 112.7344,
        geofenceRadius: 150
      }
    }),
    prisma.place_of_Interest.create({
      data: {
        name: "Pakuwon Mall",
        category: "STORE",
        latitude: -7.2891,
        longitude: 112.6726,
        geofenceRadius: 200
      }
    }),
    prisma.place_of_Interest.create({
      data: {
        name: "Surabaya Town Square",
        category: "STORE",
        latitude: -7.2656,
        longitude: 112.7414,
        geofenceRadius: 150
      }
    }),
    prisma.place_of_Interest.create({
      data: {
        name: "Rumah Makan Sederhana",
        category: "RESTAURANT",
        latitude: -7.2575,
        longitude: 112.7521,
        geofenceRadius: 50
      }
    }),
    prisma.place_of_Interest.create({
      data: {
        name: "Warung Apung Rahmawati",
        category: "RESTAURANT",
        latitude: -7.3474,
        longitude: 112.7274,
        geofenceRadius: 75
      }
    }),
    prisma.place_of_Interest.create({
      data: {
        name: "G-Walk Citraland",
        category: "RESTAURANT",
        latitude: -7.2797,
        longitude: 112.6304,
        geofenceRadius: 100
      }
    }),
    prisma.place_of_Interest.create({
      data: {
        name: "Galaxy Mall Gym",
        category: "GYM",
        latitude: -7.2701,
        longitude: 112.6738,
        geofenceRadius: 80
      }
    }),
    prisma.place_of_Interest.create({
      data: {
        name: "Taman Prestasi",
        category: "PARK",
        latitude: -7.2916,
        longitude: 112.7979,
        geofenceRadius: 120
      }
    }),
    prisma.place_of_Interest.create({
      data: {
        name: "Kebun Bibit Wonorejo",
        category: "PARK",
        latitude: -7.2814,
        longitude: 112.7831,
        geofenceRadius: 200
      }
    })
  ]);

  console.log("✅ Created", places.length, "places");

  // Create food items
  const foods = await Promise.all([
    prisma.food.create({ data: { name: "Grilled Chicken Salad", calories: 350 } }),
    prisma.food.create({ data: { name: "Oatmeal with Berries", calories: 250 } }),
    prisma.food.create({ data: { name: "Tuna Sandwich", calories: 400 } }),
    prisma.food.create({ data: { name: "Greek Yogurt", calories: 150 } }),
    prisma.food.create({ data: { name: "Protein Shake", calories: 200 } }),
    prisma.food.create({ data: { name: "Avocado Toast", calories: 300 } }),
    prisma.food.create({ data: { name: "Salmon with Vegetables", calories: 450 } }),
    prisma.food.create({ data: { name: "Banana", calories: 105 } }),
    prisma.food.create({ data: { name: "Almonds (handful)", calories: 160 } }),
    prisma.food.create({ data: { name: "Green Smoothie", calories: 180 } }),
    prisma.food.create({ data: { name: "Chicken Burrito Bowl", calories: 550 } }),
    prisma.food.create({ data: { name: "Apple", calories: 95 } })
  ]);

  console.log("✅ Created", foods.length, "food items");

  // Helper to get timestamp for days ago
  const getDaysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(8, 0, 0, 0); // Set to 8 AM
    return date.getTime();
  };

  // Create friendship
  await prisma.friend.create({
    data: {
      requester_id: user1.user_id,
      addressee_id: user2.user_id,
      status: "ACCEPTED",
      createdAt: new Date(getDaysAgo(30))
    }
  });

  console.log("✅ Created friendship between users");

  // Seed data for last 7 days for user1 (but skip today to allow notifications)
  for (let day = 7; day >= 1; day--) {
    const baseTime = getDaysAgo(day);
    const date = new Date(baseTime);
    date.setHours(0, 0, 0, 0);

    let dailyCalories = 0;

    // Breakfast (8 AM) - at a different restaurant (Warung Apung)
    const breakfastTime = baseTime;
    const breakfast = await prisma.food_Log.create({
      data: {
        user_id: user1.user_id,
        timestamp: BigInt(breakfastTime),
        latitude: -7.3474,
        longitude: 112.7274,
        foodInLogs: {
          create: [
            { food_id: foods[1].food_id, quantity: 1, calories: 250 },
            { food_id: foods[7].food_id, quantity: 1, calories: 105 }
          ]
        }
      }
    });
    dailyCalories += 355;

    // Morning snack (10:30 AM)
    const snackTime = baseTime + (2.5 * 60 * 60 * 1000);
    await prisma.food_Log.create({
      data: {
        user_id: user1.user_id,
        timestamp: BigInt(snackTime),
        latitude: -7.2644,
        longitude: 112.7378,
        foodInLogs: {
          create: [
            { food_id: foods[8].food_id, quantity: 1, calories: 160 }
          ]
        }
      }
    });
    dailyCalories += 160;

    // Lunch (1 PM)
    const lunchTime = baseTime + (5 * 60 * 60 * 1000);
    await prisma.food_Log.create({
      data: {
        user_id: user1.user_id,
        timestamp: BigInt(lunchTime),
        latitude: -7.2656,
        longitude: 112.7414,
        foodInLogs: {
          create: [
            { food_id: foods[0].food_id, quantity: 1, calories: 350 },
            { food_id: foods[3].food_id, quantity: 1, calories: 150 }
          ]
        }
      }
    });
    dailyCalories += 500;

    // Afternoon snack (4 PM)
    const afternoonSnackTime = baseTime + (8 * 60 * 60 * 1000);
    await prisma.food_Log.create({
      data: {
        user_id: user1.user_id,
        timestamp: BigInt(afternoonSnackTime),
        latitude: -7.2644,
        longitude: 112.7378,
        foodInLogs: {
          create: [
            { food_id: foods[11].food_id, quantity: 1, calories: 95 }
          ]
        }
      }
    });
    dailyCalories += 95;

    // Dinner (7 PM)
    const dinnerTime = baseTime + (11 * 60 * 60 * 1000);
    await prisma.food_Log.create({
      data: {
        user_id: user1.user_id,
        timestamp: BigInt(dinnerTime),
        latitude: -7.2575,
        longitude: 112.7521,
        foodInLogs: {
          create: [
            { food_id: foods[6].food_id, quantity: 1, calories: 450 }
          ]
        }
      }
    });
    dailyCalories += 450;

    // Create daily summary
    await prisma.daily_Summary.create({
      data: {
        user_id: user1.user_id,
        date: date,
        totalCaloriesIn: dailyCalories
      }
    });

    // Activity logs
    // Morning run (6:30 AM - 7:15 AM)
    const morningRunStart = baseTime - (1.5 * 60 * 60 * 1000);
    const morningRunEnd = morningRunStart + (45 * 60 * 1000);
    await prisma.activity_Log.create({
      data: {
        user_id: user1.user_id,
        activityType: "RUNNING",
        startTime: BigInt(morningRunStart),
        endTime: BigInt(morningRunEnd),
        confidence: 95
      }
    });

    // Gym session (5:30 PM - 7 PM) on weekdays
    if (day < 5) {
      const gymStart = baseTime + (9.5 * 60 * 60 * 1000);
      const gymEnd = gymStart + (1.5 * 60 * 60 * 1000);
      await prisma.activity_Log.create({
        data: {
          user_id: user1.user_id,
          activityType: "WEIGHTLIFTING",
          startTime: BigInt(gymStart),
          endTime: BigInt(gymEnd),
          confidence: 90
        }
      });

      // Visit log for gym
      await prisma.visit_Log.create({
        data: {
          user_id: user1.user_id,
          place_id: places[0].place_id,
          entryTime: BigInt(gymStart),
          exitTime: BigInt(gymEnd),
          durationMins: 90
        }
      });
    }

    // Walking (12 PM - 12:30 PM)
    const walkStart = baseTime + (4 * 60 * 60 * 1000);
    const walkEnd = walkStart + (30 * 60 * 1000);
    await prisma.activity_Log.create({
      data: {
        user_id: user1.user_id,
        activityType: "WALKING",
        startTime: BigInt(walkStart),
        endTime: BigInt(walkEnd),
        confidence: 85
      }
    });

    // Visit to Central Park (weekend)
    if (day === 0 || day === 1) {
      const parkVisitStart = baseTime + (10 * 60 * 60 * 1000);
      const parkVisitEnd = parkVisitStart + (2 * 60 * 60 * 1000);
      await prisma.visit_Log.create({
        data: {
          user_id: user1.user_id,
          place_id: places[2].place_id,
          entryTime: BigInt(parkVisitStart),
          exitTime: BigInt(parkVisitEnd),
          durationMins: 120
        }
      });
    }

    // EMA logs - 3 per day
    // Morning EMA (9 AM)
    const morningEmaTime = baseTime + (1 * 60 * 60 * 1000);
    await prisma.eMA_Log.create({
      data: {
        user_id: user1.user_id,
        timestamp: BigInt(morningEmaTime),
        moodScore: 7 + (day % 2),
        context: "Morning routine completed, feeling energized",
        latitude: -7.2575,
        longitude: 112.7521,
        geofenceRadius: 50
      }
    });

    // Afternoon EMA (2 PM)
    const afternoonEmaTime = baseTime + (6 * 60 * 60 * 1000);
    await prisma.eMA_Log.create({
      data: {
        user_id: user1.user_id,
        timestamp: BigInt(afternoonEmaTime),
        moodScore: 6 + (day % 3),
        context: "Post-lunch, back to work",
        latitude: -7.2644,
        longitude: 112.7378,
        geofenceRadius: 30
      }
    });

    // Evening EMA (8 PM)
    const eveningEmaTime = baseTime + (12 * 60 * 60 * 1000);
    await prisma.eMA_Log.create({
      data: {
        user_id: user1.user_id,
        timestamp: BigInt(eveningEmaTime),
        moodScore: 8 - (day % 2),
        context: "End of day, relaxing at home",
        latitude: -7.2575,
        longitude: 112.7521,
        geofenceRadius: 50
      }
    });

    console.log(`✅ Created data for day ${7 - day} (user1)`);
  }

  // Seed data for last 5 days for user2
  for (let day = 4; day >= 0; day--) {
    const baseTime = getDaysAgo(day);
    const date = new Date(baseTime);
    date.setHours(0, 0, 0, 0);

    let dailyCalories = 0;

    // Breakfast (8:30 AM)
    const breakfastTime = baseTime + (0.5 * 60 * 60 * 1000);
    await prisma.food_Log.create({
      data: {
        user_id: user2.user_id,
        timestamp: BigInt(breakfastTime),
        latitude: -7.2644,
        longitude: 112.7378,
        foodInLogs: {
          create: [
            { food_id: foods[5].food_id, quantity: 1, calories: 300 },
            { food_id: foods[9].food_id, quantity: 1, calories: 180 }
          ]
        }
      }
    });
    dailyCalories += 480;

    // Lunch (12:30 PM)
    const lunchTime = baseTime + (4.5 * 60 * 60 * 1000);
    await prisma.food_Log.create({
      data: {
        user_id: user2.user_id,
        timestamp: BigInt(lunchTime),
        latitude: -7.2656,
        longitude: 112.7414,
        foodInLogs: {
          create: [
            { food_id: foods[10].food_id, quantity: 1, calories: 550 }
          ]
        }
      }
    });
    dailyCalories += 550;

    // Snack (3 PM)
    const snackTime = baseTime + (7 * 60 * 60 * 1000);
    await prisma.food_Log.create({
      data: {
        user_id: user2.user_id,
        timestamp: BigInt(snackTime),
        latitude: -7.2575,
        longitude: 112.7521,
        foodInLogs: {
          create: [
            { food_id: foods[3].food_id, quantity: 1, calories: 150 }
          ]
        }
      }
    });
    dailyCalories += 150;

    // Dinner (6:30 PM)
    const dinnerTime = baseTime + (10.5 * 60 * 60 * 1000);
    await prisma.food_Log.create({
      data: {
        user_id: user2.user_id,
        timestamp: BigInt(dinnerTime),
        latitude: -7.2575,
        longitude: 112.7521,
        foodInLogs: {
          create: [
            { food_id: foods[2].food_id, quantity: 1, calories: 400 }
          ]
        }
      }
    });
    dailyCalories += 400;

    // Create daily summary
    await prisma.daily_Summary.create({
      data: {
        user_id: user2.user_id,
        date: date,
        totalCaloriesIn: dailyCalories
      }
    });

    // Activity logs
    // Yoga (7 AM - 8 AM)
    const yogaStart = baseTime - (1 * 60 * 60 * 1000);
    const yogaEnd = yogaStart + (60 * 60 * 1000);
    await prisma.activity_Log.create({
      data: {
        user_id: user2.user_id,
        activityType: "YOGA",
        startTime: BigInt(yogaStart),
        endTime: BigInt(yogaEnd),
        confidence: 92
      }
    });

    // Walking (lunch break)
    const walkStart = lunchTime + (30 * 60 * 1000);
    const walkEnd = walkStart + (20 * 60 * 1000);
    await prisma.activity_Log.create({
      data: {
        user_id: user2.user_id,
        activityType: "WALKING",
        startTime: BigInt(walkStart),
        endTime: BigInt(walkEnd),
        confidence: 88
      }
    });

    // Cycling (weekend)
    if (day === 0 || day === 1) {
      const cyclingStart = baseTime + (9 * 60 * 60 * 1000);
      const cyclingEnd = cyclingStart + (45 * 60 * 1000);
      await prisma.activity_Log.create({
        data: {
          user_id: user2.user_id,
          activityType: "CYCLING",
          startTime: BigInt(cyclingStart),
          endTime: BigInt(cyclingEnd),
          confidence: 90
        }
      });
    }

    // Visit to restaurant
    const restaurantStart = lunchTime;
    const restaurantEnd = restaurantStart + (60 * 60 * 1000);
    await prisma.visit_Log.create({
      data: {
        user_id: user2.user_id,
        place_id: places[1].place_id,
        entryTime: BigInt(restaurantStart),
        exitTime: BigInt(restaurantEnd),
        durationMins: 60
      }
    });

    // EMA logs
    // Morning EMA
    const morningEmaTime = baseTime + (1.5 * 60 * 60 * 1000);
    await prisma.eMA_Log.create({
      data: {
        user_id: user2.user_id,
        timestamp: BigInt(morningEmaTime),
        moodScore: 8,
        context: "Started the day with yoga, feeling great",
        latitude: -7.2644,
        longitude: 112.7378,
        geofenceRadius: 30
      }
    });

    // Afternoon EMA
    const afternoonEmaTime = baseTime + (6 * 60 * 60 * 1000);
    await prisma.eMA_Log.create({
      data: {
        user_id: user2.user_id,
        timestamp: BigInt(afternoonEmaTime),
        moodScore: 7,
        context: "Productive afternoon",
        latitude: -7.2575,
        longitude: 112.7521,
        geofenceRadius: 50
      }
    });

    // Evening EMA
    const eveningEmaTime = baseTime + (11 * 60 * 60 * 1000);
    await prisma.eMA_Log.create({
      data: {
        user_id: user2.user_id,
        timestamp: BigInt(eveningEmaTime),
        moodScore: 9,
        context: "Relaxing evening after a good day",
        latitude: -7.2644,
        longitude: 112.7378,
        geofenceRadius: 30
      }
    });

    console.log(`✅ Created data for day ${5 - day} (user2)`);
  }

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`- Users: 2`);
  console.log(`- Places: ${places.length}`);
  console.log(`- Foods: ${foods.length}`);
  console.log(`- Food Logs (user1): 35 (7 days × 5 meals)`);
  console.log(`- Food Logs (user2): 20 (5 days × 4 meals)`);
  console.log(`- Activity Logs (user1): ~21 (3 per day × 7 days)`);
  console.log(`- Activity Logs (user2): ~15 (3 per day × 5 days)`);
  console.log(`- Visit Logs (user1): ~7`);
  console.log(`- Visit Logs (user2): ~5`);
  console.log(`- EMA Logs (user1): 21 (3 per day × 7 days)`);
  console.log(`- EMA Logs (user2): 15 (3 per day × 5 days)`);
  console.log(`- Daily Summaries: 12 (7 for user1, 5 for user2)`);
  console.log(`- Friendships: 1`);
}

main()
  .catch((e: any) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
