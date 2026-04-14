// Supabase Storage for file uploads (KYC docs + deposit screenshots)
// Setup: Supabase Dashboard → Storage → Create buckets: "kyc-documents" and "deposit-screenshots"
// Make both buckets PUBLIC or use signed URLs

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function uploadFile(
  bucket: 'kyc-documents' | 'deposit-screenshots',
  file: File,
  userId: string
): Promise<{ url: string; path: string } | { error: string }> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { error: 'Storage not configured' }
  }

  const ext = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${fileName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': file.type,
        'x-upsert': 'true',
      },
      body: file,
    })

    if (!res.ok) {
      const err = await res.json()
      return { error: err.message || 'Upload failed' }
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`
    return { url: publicUrl, path: fileName }
  } catch (err: any) {
    return { error: err.message || 'Upload failed' }
  }
}

export function getPublicUrl(bucket: string, path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
}
