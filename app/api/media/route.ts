import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { createMedia, queryMedia } from "@/lib/models"
import crypto from "crypto"

export async function GET() {
  try {
    const items = await queryMedia()
    return NextResponse.json({ items })
  } catch (e) {
    console.error("GET /api/media error", e)
    return NextResponse.json({ error: "Erreur lors du chargement" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req)
    if (!auth || auth.role !== "admin") return NextResponse.json({ error: "Non autorisé" }, { status: 403 })

    const ctype = req.headers.get("content-type") || ""
    // If multipart, handle file upload to Cloudinary
    if (ctype.includes("multipart/form-data")) {
      const form = await req.formData()
      const file = form.get("file") as File | null
      const label = (form.get("label") as string) || ""
      if (!file) {
        return NextResponse.json({ error: "Fichier manquant" }, { status: 400 })
      }

      const cloudName = process.env.CLOUDINARY_CLOUD_NAME
      const apiKey = process.env.CLOUDINARY_API_KEY
      const apiSecret = process.env.CLOUDINARY_API_SECRET
      if (!cloudName || !apiKey || !apiSecret) {
        return NextResponse.json({ error: "Cloudinary non configuré" }, { status: 500 })
      }

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      const timestamp = Math.floor(Date.now() / 1000)
      // Sign only with timestamp for a basic signed upload
      const toSign = `timestamp=${timestamp}`
      const signature = crypto.createHash("sha1").update(toSign + apiSecret).digest("hex")

      const fd = new FormData()
      fd.append("file", file)
      fd.append("api_key", apiKey)
      fd.append("timestamp", String(timestamp))
      fd.append("signature", signature)

      const upRes = await fetch(uploadUrl, { method: "POST", body: fd })
      const upData = await upRes.json()
      if (!upRes.ok) {
        console.error("Cloudinary upload error:", upData)
        return NextResponse.json({ error: "Upload échoué" }, { status: 500 })
      }

      const url = upData.secure_url as string
      const id = await createMedia({ url, label })
      return NextResponse.json({ id, url })
    }

    // Fallback: JSON payload to create media by URL
    const body = await req.json()
    const id = await createMedia(body)
    return NextResponse.json({ id })
  } catch (e) {
    console.error("POST /api/media error", e)
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 })
  }
}
