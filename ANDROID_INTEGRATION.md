# Backend Data Flow & Android Integration Guide

## Project Overview
This backend tracks user health data in **Surabaya, Indonesia** including:
- Food logs (what you eat)
- Activity logs (exercise/movement via Android Activity Recognition)
- Visit logs (places you visit)
- EMA logs (mood/emotional state)
- Location-based notifications

---

## 1. Location-Based Notifications Flow

### How It Works
```
Android App (every 5-10 mins) 
  → GET /api/notifications/location-check/:userId?latitude=X&longitude=Y
  → Backend checks:
      1. Is user in Surabaya? (boundaries: lat -7.18 to -7.35, lng 112.65 to 112.85)
      2. Which places are nearby? (within 1km)
      3. Has user logged visit recently? (last 30 mins)
  → Returns: Array of notification triggers
  → Android shows notification popup
```

### Android Implementation Example
```kotlin
// In your LocationService or WorkManager
fun checkLocationTriggers(userId: Int, lat: Double, lng: Double) {
    val url = "https://your-api.com/api/notifications/location-check/$userId?latitude=$lat&longitude=$lng"
    
    // Make API call
    val response = apiClient.get(url)
    
    if (response.shouldNotify) {
        response.data.forEach { trigger ->
            // Show notification based on trigger.notificationType
            when (trigger.notificationType) {
                "FOOD_LOG" -> showFoodLogNotification(trigger)
                "ACTIVITY_LOG" -> showActivityNotification(trigger)
                "EMA_LOG" -> showMoodNotification(trigger)
                "VISIT_LOG" -> showVisitNotification(trigger)
            }
        }
    }
}

fun showFoodLogNotification(trigger: NotificationTrigger) {
    NotificationCompat.Builder(context, CHANNEL_ID)
        .setContentTitle("Log Your Meal")
        .setContentText(trigger.message) // "You're at Warung Makan. Log your meal?"
        .setSmallIcon(R.drawable.ic_food)
        .setPriority(NotificationCompat.PRIORITY_HIGH)
        .setContentIntent(createFoodLogIntent(trigger.placeId))
        .build()
}
```

---

## 2. Android Activity Recognition Flow

### How It Works
```
Android Activity Recognition API (detects user activity)
  → Stores activities locally
  → Every 30 mins or when WiFi connected:
      POST /api/activity-logs/bulk with array of activities
  → Backend saves to database
  → You can query: GET /api/activity-logs/user/:userId/current
```

### Activity Types
- `STILL` - User not moving
- `WALKING` - Walking
- `RUNNING` - Running/jogging
- `ON_BICYCLE` - Cycling
- `IN_VEHICLE` - In car/bus
- `ON_FOOT` - Walking or running

### Android Implementation Example
```kotlin
// Set up Activity Recognition
fun startActivityRecognition() {
    val client = ActivityRecognition.getClient(context)
    val intent = PendingIntent.getService(
        context, 0,
        Intent(context, ActivityRecognitionService::class.java),
        PendingIntent.FLAG_UPDATE_CURRENT
    )
    
    // Request updates every 30 seconds
    client.requestActivityUpdates(30000, intent)
}

// In ActivityRecognitionService
override fun onHandleIntent(intent: Intent?) {
    val result = ActivityRecognitionResult.extractResult(intent)
    val activity = result.mostProbableActivity
    
    // Store locally first
    val activityLog = ActivityLog(
        user_id = currentUserId,
        activityType = getActivityName(activity.type),
        startTime = System.currentTimeMillis(),
        endTime = System.currentTimeMillis() + 30000,
        confidence = activity.confidence
    )
    localDatabase.insert(activityLog)
    
    // Batch upload when appropriate
    if (shouldSyncNow()) {
        uploadActivitiesBatch()
    }
}

fun uploadActivitiesBatch() {
    val activities = localDatabase.getUnsynced()
    val json = JSONObject().apply {
        put("activities", JSONArray(activities))
    }
    
    apiClient.post("/api/activity-logs/bulk", json)
    localDatabase.markAsSynced(activities)
}
```

---

## 3. Data Models You'll Use

### Food Log Flow
```kotlin
// User gets notification at restaurant
// User taps notification → Opens Food Log screen
// User selects food items and quantities
data class FoodLogRequest(
    val user_id: Int,
    val timestamp: Long,
    val latitude: Double?,
    val longitude: Double?,
    val foods: List<FoodItem>
)

data class FoodItem(
    val food_id: Int,
    val quantity: Int,
    val calories: Int
)

// POST to /api/food-logs
// Then POST each food item to /api/food-in-logs
```

### Visit Log Flow
```kotlin
// Track when user enters/exits a place
data class VisitLogRequest(
    val user_id: Int,
    val place_id: Int,
    val entryTime: Long,
    val exitTime: Long,
    val durationMins: Int
)

// POST to /api/visit-logs
```

### EMA (Mood) Log Flow
```kotlin
// Show mood survey popup
data class EmaLogRequest(
    val user_id: Int,
    val moodScore: Int,        // 1-10 scale
    val context: String?,      // "At park with friends"
    val timestamp: Long,
    val latitude: Double?,
    val longitude: Double?
)

// POST to /api/ema-logs
```

---

## 4. Recommended Android Architecture

```
┌─────────────────────────────────────────┐
│          Android Components             │
├─────────────────────────────────────────┤
│ 1. LocationService (background)         │
│    - Tracks GPS every 5-10 mins         │
│    - Calls location-check API           │
│    - Triggers notifications             │
│                                         │
│ 2. ActivityRecognitionService           │
│    - Receives activity updates          │
│    - Stores locally in Room DB          │
│    - Batch syncs to backend             │
│                                         │
│ 3. NotificationManager                  │
│    - Shows location-based popups        │
│    - Opens appropriate log screen       │
│                                         │
│ 4. SyncService (WorkManager)            │
│    - Periodic sync every 30 mins        │
│    - Upload pending logs                │
│    - Download daily summaries           │
└─────────────────────────────────────────┘
```

---

## 5. Database Setup & Sample Data

### Add Sample Places in Surabaya
```sql
-- Run this to add sample places for testing
INSERT INTO place_of_interest (name, category, latitude, longitude, geofenceRadius)
VALUES 
  ('Warung Bu Kris', 'RESTAURANT', -7.2575, 112.7521, 100),
  ('Taman Bungkul', 'PARK', -7.2894, 112.7344, 200),
  ('FIT Hub Gym', 'GYM', -7.2819, 112.7943, 100),
  ('Galaxy Mall', 'STORE', -7.2607, 112.7351, 150);
```

### Testing the Flow
1. **Register a user:**
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"123456","bmiGoal":22,"weight":70,"height":170}'
```

2. **Check location triggers:**
```bash
curl "http://localhost:3000/api/notifications/location-check/1?latitude=-7.2575&longitude=112.7521"
```

3. **Upload activity logs:**
```bash
curl -X POST http://localhost:3000/api/activity-logs/bulk \
  -H "Content-Type: application/json" \
  -d '{"activities":[{"user_id":1,"activityType":"WALKING","startTime":1702425600000,"endTime":1702427400000,"confidence":85}]}'
```

---

## 6. Key Considerations

### Battery Optimization
- **Location checks:** Use `FusedLocationProviderClient` with `PRIORITY_BALANCED_POWER_ACCURACY`
- **Activity Recognition:** 30-60 second intervals is enough
- **Batch uploads:** Sync when on WiFi and charging

### Privacy & Permissions
- Request `ACCESS_FINE_LOCATION` for GPS
- Request `ACTIVITY_RECOGNITION` permission (Android 10+)
- Explain to users why you need these permissions

### Offline Support
- Store all logs in local Room database first
- Add `isSynced: Boolean` flag
- Sync when network available
- Handle conflicts (backend timestamp wins)

### Notification Best Practices
- Don't spam - max 1 notification per place per 30 mins
- Let users disable notifications
- Use notification channels for different types
- Clear notifications when user logs data

---

## 7. Testing Checklist

- [ ] User can register and login
- [ ] Location check returns nearby places in Surabaya
- [ ] Location check rejects coordinates outside Surabaya
- [ ] Notification shows when near a place
- [ ] Activity Recognition detects walking/running
- [ ] Activity logs batch upload successfully
- [ ] Food log creates with multiple items
- [ ] Visit log tracks entry/exit times
- [ ] EMA log saves mood data with location

---

## Need Help?

- Check Prisma schema: `prisma/schema.prisma`
- View all routes: `src/routes/publicApi.ts`
- Test endpoints: Use Postman or Thunder Client in VS Code
