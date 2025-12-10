/*
  Warnings:

  - A unique constraint covering the columns `[user_id,date]` on the table `daily_summary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[requester_id,addressee_id]` on the table `friends` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "activity_log_user_id_idx" ON "activity_log"("user_id");

-- CreateIndex
CREATE INDEX "activity_log_activityType_idx" ON "activity_log"("activityType");

-- CreateIndex
CREATE INDEX "activity_log_startTime_idx" ON "activity_log"("startTime");

-- CreateIndex
CREATE INDEX "activity_log_user_id_startTime_idx" ON "activity_log"("user_id", "startTime");

-- CreateIndex
CREATE INDEX "daily_summary_user_id_idx" ON "daily_summary"("user_id");

-- CreateIndex
CREATE INDEX "daily_summary_date_idx" ON "daily_summary"("date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_summary_user_id_date_key" ON "daily_summary"("user_id", "date");

-- CreateIndex
CREATE INDEX "ema_log_user_id_idx" ON "ema_log"("user_id");

-- CreateIndex
CREATE INDEX "ema_log_timestamp_idx" ON "ema_log"("timestamp");

-- CreateIndex
CREATE INDEX "ema_log_user_id_timestamp_idx" ON "ema_log"("user_id", "timestamp");

-- CreateIndex
CREATE INDEX "ema_log_latitude_longitude_idx" ON "ema_log"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "food_log_user_id_idx" ON "food_log"("user_id");

-- CreateIndex
CREATE INDEX "food_log_timestamp_idx" ON "food_log"("timestamp");

-- CreateIndex
CREATE INDEX "food_log_user_id_timestamp_idx" ON "food_log"("user_id", "timestamp");

-- CreateIndex
CREATE INDEX "friends_requester_id_idx" ON "friends"("requester_id");

-- CreateIndex
CREATE INDEX "friends_addressee_id_idx" ON "friends"("addressee_id");

-- CreateIndex
CREATE INDEX "friends_status_idx" ON "friends"("status");

-- CreateIndex
CREATE UNIQUE INDEX "friends_requester_id_addressee_id_key" ON "friends"("requester_id", "addressee_id");

-- CreateIndex
CREATE INDEX "place_of_interest_category_idx" ON "place_of_interest"("category");

-- CreateIndex
CREATE INDEX "place_of_interest_latitude_longitude_idx" ON "place_of_interest"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "visit_log_user_id_idx" ON "visit_log"("user_id");

-- CreateIndex
CREATE INDEX "visit_log_place_id_idx" ON "visit_log"("place_id");

-- CreateIndex
CREATE INDEX "visit_log_entryTime_idx" ON "visit_log"("entryTime");

-- CreateIndex
CREATE INDEX "visit_log_user_id_entryTime_idx" ON "visit_log"("user_id", "entryTime");
