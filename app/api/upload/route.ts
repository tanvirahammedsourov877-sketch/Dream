import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    const blob = file as Blob;
    // Check size limit: 15MB
    if (blob.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image size exceeds 15MB limit' }, { status: 400 });
    }

    const bytes = await blob.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Derive file extension safely
    let ext = '.jpg';
    if ('name' in blob && typeof (blob as any).name === 'string') {
      const origExt = path.extname((blob as any).name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'].includes(origExt)) {
        ext = origExt;
      }
    } else if (blob.type) {
      const typeMap: Record<string, string> = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/webp': '.webp',
        'image/gif': '.gif',
        'image/svg+xml': '.svg',
        'image/avif': '.avif',
      };
      if (typeMap[blob.type]) ext = typeMap[blob.type];
    }

    const uniqueName = `template_${Date.now()}_${Math.random().toString(36).substring(2, 9)}${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueName}`;
    return NextResponse.json({ success: true, url: publicUrl, filename: uniqueName });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to upload image' }, { status: 500 });
  }
}
