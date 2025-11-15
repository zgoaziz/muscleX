 import { MongoClient, Db, Collection, Document } from "mongodb"

 const DEFAULT_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/muscle"
 const DB_NAME = process.env.MONGODB_DB || "muscle"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function getMongoClient(): Promise<MongoClient> {
  if (cachedClient) return cachedClient
  const tlsInsecure = process.env.MONGODB_TLS_INSECURE === "true"
  const client = new MongoClient(
    DEFAULT_URI,
    tlsInsecure
      ? { tlsAllowInvalidCertificates: true, tlsAllowInvalidHostnames: true }
      : {}
  )
  await client.connect()
  cachedClient = client
  return client
}

export async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb
  const client = await getMongoClient()
  const db = client.db(DB_NAME)
  cachedDb = db
  return db
}

export async function getCollection<T extends Document = Document>(name: string): Promise<Collection<T>> {
  const db = await getDb()
  return db.collection<T>(name)
}
