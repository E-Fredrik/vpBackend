import bcrypt from "bcrypt";
import { prismaClient } from "./utils/databaseUtil";

async function main() {
	// create or find user
	const userEmail = "seed@example.com";
	let user = await prismaClient.user.findUnique({
		where: { email: userEmail },
	});
	if (!user) {
		const hashed = await bcrypt.hash("password", 10);
		user = await prismaClient.user.create({
			data: {
				username: "seed_user",
				email: userEmail,
				password: hashed,
			},
		});
	}

	// create foods (skip duplicates)
	const foodsData = [
		{ name: "Apple", calories: 95 },
		{ name: "Banana", calories: 105 },
		{ name: "Sandwich", calories: 300 },
	];
	await prismaClient.food.createMany({ data: foodsData, skipDuplicates: true });

	// fetch foods to get ids
	const foods = await prismaClient.food.findMany({
		where: { name: { in: foodsData.map((f) => f.name) } },
	});
	const byName = new Map(foods.map((f) => [f.name, f.food_id]));

	// create a food log with multiple foodInLogs
	const createdLog = await prismaClient.food_Log.create({
		data: {
			user_id: user.user_id,
			timestamp: BigInt(Date.now()),
			latitude: 12.34,
			longitude: 56.78,
			foodInLogs: {
				create: [
					{
						quantity: 2,
						calories: byName.get("Apple")
							? 2 * foods.find((f) => f.name === "Apple")!.calories
							: 0,
						food: { connect: { food_id: byName.get("Apple")! } },
					},
					{
						quantity: 1,
						calories: byName.get("Banana")
							? foods.find((f) => f.name === "Banana")!.calories
							: 0,
						food: { connect: { food_id: byName.get("Banana")! } },
					},
				],
			},
		},
		include: {
			foodInLogs: { include: { food: true } },
		},
	});

	console.log("Seed complete:");
	console.log({ user: { id: user.user_id, email: user.email }, createdLog });
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prismaClient.$disconnect();
	});
