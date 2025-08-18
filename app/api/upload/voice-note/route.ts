import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('🎙️ Voice note upload request received')
    
    // Get the uploaded file from FormData
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    
    if (!audioFile) {
      console.error('❌ No audio file provided')
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    console.log('🎙️ Audio file details:', {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type
    })

    // Validate file type (expanded for high-quality formats)
    const allowedTypes = [
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/mp4',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/ogg;codecs=opus'
    ]

    // Check if the file type starts with any allowed type (handles codec specifications)
    const isValidType = allowedTypes.some(type =>
      audioFile.type === type || audioFile.type.startsWith(type.split(';')[0])
    )

    if (!isValidType) {
      console.error('❌ Invalid file type:', audioFile.type)
      return NextResponse.json(
        { error: 'Invalid file type. Only audio files are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (audioFile.size > maxSize) {
      console.error('❌ File too large:', audioFile.size)
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = createServiceRoleClient()

    // Generate unique filename
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    const fileExtension = audioFile.name.split('.').pop() || 'webm'
    const fileName = `voice-note-${timestamp}-${randomId}.${fileExtension}`

    console.log('🎙️ Uploading to Supabase storage:', fileName)

    // Convert File to ArrayBuffer for Supabase upload
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('voice-notes')
      .upload(fileName, buffer, {
        contentType: audioFile.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('❌ Supabase upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload voice note' },
        { status: 500 }
      )
    }

    console.log('✅ Upload successful:', uploadData)

    // Create time-bound signed URL for private playback
    const { data: signed, error: signErr } = await supabase.storage
      .from('voice-notes')
      .createSignedUrl(fileName, 3600) // 1 hour TTL

    if (signErr || !signed?.signedUrl) {
      console.error('❌ Failed to create signed URL:', signErr)
      return NextResponse.json(
        { error: 'Failed to create signed URL' },
        { status: 500 }
      )
    }

    console.log('✅ Voice note uploaded successfully (signed URL issued)')

    return NextResponse.json({
      success: true,
      path: fileName,
      signedUrl: signed.signedUrl,
      size: audioFile.size,
      type: audioFile.type
    })

  } catch (error) {
    console.error('❌ Voice note upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
