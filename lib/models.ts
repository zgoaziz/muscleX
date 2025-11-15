import { ObjectId } from "mongodb"
import { getCollection } from "./mongodb"

// Users
export async function createUser(userData: any) {
  const users = await getCollection("users")
  const now = new Date()
  const doc = {
    ...userData,
    role: userData.role || "user",
    joinDate: userData.joinDate || now.toISOString(),
    createdAt: now,
    lastWorkoutDate: null,
    dailyStats: [],
    workoutHistory: [],
    totalWorkouts: 0,
    stats: {
      totalDuration: 0,
      totalCalories: 0,
      favoriteExercises: [],
      weeklyWorkouts: 0,
      streak: 0,
    },
  }
  const res = await users.insertOne(doc as any)
  return res.insertedId.toString()
}

export async function getUserByEmail(email: string) {
  const users = await getCollection("users")
  return users.findOne({ email })
}

export async function getUserById(id: string) {
  const users = await getCollection("users")
  const _id = new ObjectId(id)
  return users.findOne({ _id })
}

export async function updateUser(id: string, updates: any) {
  const users = await getCollection("users")
  const _id = new ObjectId(id)
  const res = await users.findOneAndUpdate(
    { _id },
    { $set: { ...updates } },
    { returnDocument: "after" }
  )
  return res
}

export async function getAllUsers() {
  const users = await getCollection("users")
  return users.find({}).toArray()
}

export async function deleteUser(id: string) {
  const users = await getCollection("users")
  const _id = new ObjectId(id)
  await users.deleteOne({ _id })
  return true
}

// Workout sessions
export async function createWorkoutSession(sessionData: any) {
  const sessions = await getCollection("workoutSessions")
  const doc = { ...sessionData, createdAt: new Date() }
  const res = await sessions.insertOne(doc as any)
  return res.insertedId.toString()
}

export async function getWorkoutSessionsByUserId(userId: string) {
  const sessions = await getCollection("workoutSessions")
  return sessions.find({ userId }).toArray()
}

export async function queryWorkoutSessions(userId: string, opts: {
  q?: string
  status?: "completed" | "in_progress"
  type?: string
  from?: string
  to?: string
} = {}) {
  const sessions = await getCollection("workoutSessions")
  const filter: any = { userId }
  if (opts.status) filter.status = opts.status
  if (opts.type) filter.type = opts.type
  if (opts.q) filter.$or = [
    { title: { $regex: opts.q, $options: "i" } },
    { workoutName: { $regex: opts.q, $options: "i" } },
  ]
  if (opts.from || opts.to) {
    filter.createdAt = {}
    if (opts.from) filter.createdAt.$gte = new Date(opts.from)
    if (opts.to) filter.createdAt.$lte = new Date(opts.to)
  }
  return sessions.find(filter).sort({ createdAt: -1 }).toArray()
}

export async function updateWorkoutSession(id: string, updates: any) {
  const sessions = await getCollection("workoutSessions")
  const _id = new ObjectId(id)
  const res = await sessions.findOneAndUpdate({ _id }, { $set: { ...updates, updatedAt: new Date() } }, { returnDocument: "after" })
  return res
}

export async function deleteWorkoutSession(id: string) {
  const sessions = await getCollection("workoutSessions")
  const _id = new ObjectId(id)
  await sessions.deleteOne({ _id })
  return true
}

// Exercises & Taxonomies
export async function queryExercises(opts: {
  q?: string
  muscles?: string[]
  levels?: string[]
  equipment?: string[]
} = {}) {
  const col = await getCollection("exercises")
  const filter: any = {}
  if (opts.q) filter.name = { $regex: opts.q, $options: "i" }
  if (opts.muscles && opts.muscles.length) filter.muscles = { $in: opts.muscles }
  if (opts.levels && opts.levels.length) filter.level = { $in: opts.levels }
  if (opts.equipment && opts.equipment.length) filter.equipment = { $in: opts.equipment }
  return col.find(filter).sort({ createdAt: -1 }).toArray()
}

export async function createExercise(doc: any) {
  const col = await getCollection("exercises")
  const now = new Date()
  const res = await col.insertOne({
    name: doc.name,
    description: doc.description || "",
    muscles: Array.isArray(doc.muscles) ? doc.muscles : [],
    level: doc.level || "",
    equipment: Array.isArray(doc.equipment) ? doc.equipment : [],
    media: Array.isArray(doc.media) ? doc.media : [],
    createdAt: now,
    updatedAt: now,
  } as any)
  return res.insertedId.toString()
}

export async function updateExercise(id: string, updates: any) {
  const col = await getCollection("exercises")
  const _id = new ObjectId(id)
  const res = await col.findOneAndUpdate(
    { _id },
    { $set: { ...updates, updatedAt: new Date() } },
    { returnDocument: "after" }
  )
  return res
}

export async function deleteExercise(id: string) {
  const col = await getCollection("exercises")
  const _id = new ObjectId(id)
  await col.deleteOne({ _id })
  return true
}

export async function getTaxonomies() {
  // Persist taxonomies in 'muscle' collection as a single doc with _key: 'taxonomies'
  const col = await getCollection("muscle")
  const doc = await col.findOne({ _key: "taxonomies" })
  const value = doc?.value || {}
  return {
    muscles: Array.isArray(value.muscles) ? value.muscles : [],
    levels: Array.isArray(value.levels) ? value.levels : [],
    equipment: Array.isArray(value.equipment) ? value.equipment : [],
  }
}

export async function updateTaxonomies(value: { muscles: string[]; levels: string[]; equipment: string[] }) {
  const col = await getCollection("muscle")
  await col.updateOne(
    { _key: "taxonomies" },
    { $set: { value, updatedAt: new Date() } },
    { upsert: true }
  )
  return true
}

// Notifications
export async function createNotification(notifData: any) {
  const col = await getCollection("notifications")
  const doc = { ...notifData, createdAt: new Date() }
  const res = await col.insertOne(doc as any)
  return res.insertedId.toString()
}

export async function getNotifications() {
  const col = await getCollection("notifications")
  return col.find({}).sort({ createdAt: -1 }).toArray()
}

// Derived updates/statistics
export async function addWorkoutToUser(userId: string, workout: any) {
  const users = await getCollection("users")
  const _id = new ObjectId(userId)
  const today = new Date().toISOString().split("T")[0]

  const user = await users.findOne({ _id })
  if (!user) return null

  const dailyStats = Array.isArray(user.dailyStats) ? user.dailyStats : []
  let dailyStat = dailyStats.find((ds: any) => ds.date === today)
  if (!dailyStat) {
    dailyStat = { date: today, workoutsCompleted: 0, totalDuration: 0, totalCalories: 0, exercises: [] }
    dailyStats.push(dailyStat)
  }

  dailyStat.workoutsCompleted += 1
  dailyStat.totalDuration += workout.duration || 0
  dailyStat.totalCalories += workout.calories || 0

  const workoutHistory = Array.isArray(user.workoutHistory) ? user.workoutHistory : []
  workoutHistory.push({ ...workout, completedAt: new Date().toISOString() })

  const stats = user.stats || { totalDuration: 0, totalCalories: 0, favoriteExercises: [], weeklyWorkouts: 0, streak: 0 }
  stats.totalDuration = (stats.totalDuration || 0) + (workout.duration || 0)
  stats.totalCalories = (stats.totalCalories || 0) + (workout.calories || 0)

  const res = await users.findOneAndUpdate(
    { _id },
    {
      $set: {
        dailyStats,
        workoutHistory,
        totalWorkouts: (user.totalWorkouts || 0) + 1,
        lastWorkoutDate: today,
        stats,
      },
    },
    { returnDocument: "after" }
  )
  return res
}

export async function getUserStats(userId: string) {
  const users = await getCollection("users")
  const _id = new ObjectId(userId)
  const user = await users.findOne({ _id }, { projection: { stats: 1 } })
  return user?.stats || null
}

export async function getDailyStats(userId: string, days = 7) {
  const users = await getCollection("users")
  const _id = new ObjectId(userId)
  const user = await users.findOne({ _id }, { projection: { dailyStats: 1 } })
  if (!user || !Array.isArray(user.dailyStats)) return []
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)
  return user.dailyStats.filter((stat: any) => new Date(stat.date) >= cutoffDate)
}

// Workout Programs (for public /workouts)
export async function queryPrograms(opts: { level?: string | null } = {}) {
  const col = await getCollection("programs")
  const filter: any = {}
  if (opts.level) filter.level = opts.level
  return col.find(filter).sort({ createdAt: -1 }).toArray()
}

export async function createProgram(doc: any) {
  const col = await getCollection("programs")
  const now = new Date()
  const res = await col.insertOne({
    name: doc.name,
    description: doc.description || "",
    image: doc.image || "",
    level: doc.level || "",
    duration: Number(doc.duration) || 0,
    sessionsPerWeek: Number(doc.sessionsPerWeek) || 0,
    exercises: Array.isArray(doc.exercises) ? doc.exercises : [],
    createdAt: now,
    updatedAt: now,
  } as any)
  return res.insertedId.toString()
}

export async function updateProgram(id: string, updates: any) {
  const col = await getCollection("programs")
  const _id = new ObjectId(id)
  const res = await col.findOneAndUpdate({ _id }, { $set: { ...updates, updatedAt: new Date() } }, { returnDocument: "after" })
  return res
}

export async function deleteProgram(id: string) {
  const col = await getCollection("programs")
  const _id = new ObjectId(id)
  await col.deleteOne({ _id })
  return true
}

// Media Library
export async function queryMedia() {
  const col = await getCollection("media")
  return col.find({}).sort({ createdAt: -1 }).toArray()
}

export async function createMedia(doc: any) {
  const col = await getCollection("media")
  const now = new Date()
  const res = await col.insertOne({ url: doc.url, label: doc.label || "", createdAt: now } as any)
  return res.insertedId.toString()
}

export async function deleteMedia(id: string) {
  const col = await getCollection("media")
  const _id = new ObjectId(id)
  await col.deleteOne({ _id })
  return true
}

// Admin analytics counts
export async function getAdminCounts() {
  const users = await getCollection("users")
  const exercises = await getCollection("exercises")
  const sessions = await getCollection("workoutSessions")
  const programs = await getCollection("programs")

  const [userCount, exerciseCount, sessionCount, programCount] = await Promise.all([
    users.countDocuments({}),
    exercises.countDocuments({}),
    sessions.countDocuments({}),
    programs.countDocuments({}),
  ])
  return { userCount, exerciseCount, sessionCount, programCount }
}
