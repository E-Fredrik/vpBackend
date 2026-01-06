import { prismaClient } from "../utils/databaseUtil"
import { ResponseError } from "../error/responseError"

export interface DashboardStats {
    todayCalories: number
    todayActivities: number
    todayVisits: number
    weeklyProgress: {
        date: string
        calories: number
        activities: number
    }[]
    recentFriendActivities: {
        friendId: number
        friendName: string
        activityType: string
        timestamp: number
    }[]
    recentFriendFoodLogs: {
        friendId: number
        friendName: string
        foodName: string
        calories: number
        quantity: number
        timestamp: number
    }[]
}

export class DashboardService {
    static async getDashboardData(userId: number): Promise<DashboardStats> {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        
        const todayTimestamp = BigInt(Math.floor(today.getTime()))
        const tomorrowTimestamp = BigInt(Math.floor(tomorrow.getTime()))

        // Get today's food logs calories
        const todayFoodLogs = await prismaClient.food_Log.findMany({
            where: {
                user_id: userId,
                timestamp: {
                    gte: todayTimestamp,
                    lt: tomorrowTimestamp,
                }
            },
            include: {
                foodInLogs: {
                    include: {
                        food: true
                    }
                }
            }
        })

        const todayCalories = todayFoodLogs.reduce((total: number, log) => {
            return total + log.foodInLogs.reduce((logTotal: number, foodInLog) => {
                const calories = foodInLog.calories ?? (foodInLog.food.calories * (foodInLog.quantity ?? 1))
                return logTotal + calories
            }, 0)
        }, 0)

        // Get today's activities count
        const todayActivities = await prismaClient.activity_Log.count({
            where: {
                user_id: userId,
                startTime: {
                    gte: todayTimestamp,
                    lt: tomorrowTimestamp,
                }
            }
        })

        // Get today's visits count
        const todayVisits = await prismaClient.visit_Log.count({
            where: {
                user_id: userId,
                entryTime: {
                    gte: todayTimestamp,
                    lt: tomorrowTimestamp,
                }
            }
        })

        // Get weekly progress (last 7 days)
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)
        const weekAgoTimestamp = BigInt(Math.floor(weekAgo.getTime()))

        const weeklyFoodLogs = await prismaClient.food_Log.findMany({
            where: {
                user_id: userId,
                timestamp: {
                    gte: weekAgoTimestamp,
                }
            },
            include: {
                foodInLogs: {
                    include: {
                        food: true
                    }
                }
            }
        })

        const weeklyActivityLogs = await prismaClient.activity_Log.findMany({
            where: {
                user_id: userId,
                startTime: {
                    gte: weekAgoTimestamp,
                }
            }
        })

        // Group by date
        const weeklyProgressMap = new Map<string, { calories: number, activities: number }>()
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]
            weeklyProgressMap.set(dateStr, { calories: 0, activities: 0 })
        }

        weeklyFoodLogs.forEach((log) => {
            const logDate = new Date(Number(log.timestamp))
            const dateStr = logDate.toISOString().split('T')[0]
            const calories = log.foodInLogs.reduce((total: number, foodInLog) => {
                const itemCalories = foodInLog.calories ?? (foodInLog.food.calories * (foodInLog.quantity ?? 1))
                return total + itemCalories
            }, 0)
            
            if (weeklyProgressMap.has(dateStr)) {
                weeklyProgressMap.get(dateStr)!.calories += calories
            }
        })

        weeklyActivityLogs.forEach((log) => {
            const logDate = new Date(Number(log.startTime))
            const dateStr = logDate.toISOString().split('T')[0]
            if (weeklyProgressMap.has(dateStr)) {
                weeklyProgressMap.get(dateStr)!.activities += 1
            }
        })

        const weeklyProgress = Array.from(weeklyProgressMap.entries())
            .map(([date, data]) => ({ date, ...data }))
            .reverse()

        // Get recent friend activities
        const friends = await prismaClient.friend.findMany({
            where: {
                OR: [
                    { requester_id: userId, status: 'ACCEPTED' },
                    { addressee_id: userId, status: 'ACCEPTED' }
                ]
            },
            include: {
                requester: { select: { user_id: true, username: true } },
                addressee: { select: { user_id: true, username: true } },
            }
        })

        const friendIds = friends.map(f => 
            f.requester_id === userId ? f.addressee_id : f.requester_id
        )

        const recentActivities = await prismaClient.activity_Log.findMany({
            where: {
                user_id: { in: friendIds }
            },
            include: {
                user: { select: { user_id: true, username: true } }
            },
            orderBy: {
                startTime: 'desc'
            },
            take: 10
        })

        const recentFriendActivities = recentActivities.map((activity) => ({
            friendId: activity.user_id,
            friendName: activity.user.username,
            activityType: activity.activityType,
            timestamp: Number(activity.startTime),
        }))

        // Get recent friend food logs
        const recentFriendFoods = await prismaClient.food_Log.findMany({
            where: {
                user_id: { in: friendIds }
            },
            include: {
                user: { select: { user_id: true, username: true } },
                foodInLogs: {
                    include: {
                        food: true
                    }
                }
            },
            orderBy: {
                timestamp: 'desc'
            },
            take: 20
        })

        const recentFriendFoodLogs = recentFriendFoods.flatMap((log) => 
            log.foodInLogs.map((foodInLog) => ({
                friendId: log.user_id,
                friendName: log.user.username,
                foodName: foodInLog.food.name,
                calories: foodInLog.calories ?? (foodInLog.food.calories * (foodInLog.quantity ?? 1)),
                quantity: foodInLog.quantity ?? 1,
                timestamp: Number(log.timestamp),
            }))
        ).slice(0, 10)

        return {
            todayCalories,
            todayActivities,
            todayVisits,
            weeklyProgress,
            recentFriendActivities,
            recentFriendFoodLogs,
        }
    }
}
