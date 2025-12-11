[dotenv@17.2.3] injecting env (3) from .env -- tip: ⚙️  specify custom .env file path with { path: '/custom/path/.env' }
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNDISCLOSED');

-- CreateEnum
CREATE TYPE "HealthCondition" AS ENUM ('HEART_CONDITION', 'RESPIRATORY_ISSUES', 'DIABETES', 'HYPERTENSION');

-- CreateEnum
CREATE TYPE "FriendStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "PlaceCategory" AS ENUM ('RESTAURANT', 'PARK', 'GYM', 'STORE', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "bmiGoal" DOUBLE PRECISION,
    "height" INTEGER,
    "healthCondition" "HealthCondition",
    "weight" DOUBLE PRECISION,
    "email" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "gender" "Gender",

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "friends" (
    "friend_id" SERIAL NOT NULL,
    "requester_id" INTEGER NOT NULL,
    "addressee_id" INTEGER NOT NULL,
    "status" "FriendStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "friends_pkey" PRIMARY KEY ("friend_id")
);

-- CreateTable
CREATE TABLE "daily_summary" (
    "summary_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalCaloriesIn" INTEGER NOT NULL,

    CONSTRAINT "daily_summary_pkey" PRIMARY KEY ("summary_id")
);

-- CreateTable
CREATE TABLE "place_of_interest" (
    "place_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "PlaceCategory" NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "geofenceRadius" INTEGER NOT NULL,

    CONSTRAINT "place_of_interest_pkey" PRIMARY KEY ("place_id")
);

-- CreateTable
CREATE TABLE "food" (
    "food_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,

    CONSTRAINT "food_pkey" PRIMARY KEY ("food_id")
);

-- CreateTable
CREATE TABLE "food_log" (
    "log_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "food_log_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "food_log_items" (
    "id" SERIAL NOT NULL,
    "log_id" INTEGER NOT NULL,
    "food_id" INTEGER NOT NULL,
    "quantity" INTEGER,
    "calories" INTEGER,

    CONSTRAINT "food_log_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_log" (
    "activity_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "activityType" TEXT NOT NULL,
    "startTime" BIGINT NOT NULL,
    "endTime" BIGINT NOT NULL,
    "confidence" INTEGER NOT NULL,

    CONSTRAINT "activity_log_pkey" PRIMARY KEY ("activity_id")
);

-- CreateTable
CREATE TABLE "visit_log" (
    "visit_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "place_id" INTEGER NOT NULL,
    "entryTime" BIGINT NOT NULL,
    "exitTime" BIGINT NOT NULL,
    "durationMins" INTEGER NOT NULL,

    CONSTRAINT "visit_log_pkey" PRIMARY KEY ("visit_id")
);

-- CreateTable
CREATE TABLE "ema_log" (
    "ema_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "geofenceRadius" INTEGER NOT NULL,

    CONSTRAINT "ema_log_pkey" PRIMARY KEY ("ema_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "place_of_interest_category_idx" ON "place_of_interest"("category");

-- CreateIndex
CREATE INDEX "place_of_interest_latitude_longitude_idx" ON "place_of_interest"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "activity_log_user_id_idx" ON "activity_log"("user_id");

-- CreateIndex
CREATE INDEX "activity_log_activityType_idx" ON "activity_log"("activityType");

-- CreateIndex
CREATE INDEX "activity_log_startTime_idx" ON "activity_log"("startTime");

-- CreateIndex
CREATE INDEX "activity_log_user_id_startTime_idx" ON "activity_log"("user_id", "startTime");

-- CreateIndex
CREATE INDEX "visit_log_user_id_idx" ON "visit_log"("user_id");

-- CreateIndex
CREATE INDEX "visit_log_place_id_idx" ON "visit_log"("place_id");

-- CreateIndex
CREATE INDEX "visit_log_entryTime_idx" ON "visit_log"("entryTime");

-- CreateIndex
CREATE INDEX "visit_log_user_id_entryTime_idx" ON "visit_log"("user_id", "entryTime");

-- CreateIndex
CREATE INDEX "ema_log_user_id_idx" ON "ema_log"("user_id");

-- CreateIndex
CREATE INDEX "ema_log_timestamp_idx" ON "ema_log"("timestamp");

-- CreateIndex
CREATE INDEX "ema_log_user_id_timestamp_idx" ON "ema_log"("user_id", "timestamp");

-- CreateIndex
CREATE INDEX "ema_log_latitude_longitude_idx" ON "ema_log"("latitude", "longitude");

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_addressee_id_fkey" FOREIGN KEY ("addressee_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_summary" ADD CONSTRAINT "daily_summary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_log" ADD CONSTRAINT "food_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_log_items" ADD CONSTRAINT "food_log_items_log_id_fkey" FOREIGN KEY ("log_id") REFERENCES "food_log"("log_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_log_items" ADD CONSTRAINT "food_log_items_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food"("food_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_log" ADD CONSTRAINT "visit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_log" ADD CONSTRAINT "visit_log_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "place_of_interest"("place_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ema_log" ADD CONSTRAINT "ema_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

