'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  UploadCloud,
  ImageIcon,
  X,
  Loader2,
  Link2,
  CheckCircle2,
  Trash2,
  RefreshCw,
  FileImage,
} from 'lucide-react';

interface ImageDropzoneUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

/**
 * Compress an image file using an offscreen canvas to keep size small
 * while preserving high visual quality.
 */
async function compressImageToDataUrl(file: File, maxDimension = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first, fallback to JPEG
        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(dataUrl);
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image file to the Next.js /api/upload endpoint,
 * with automatic fallback to client-side compressed Data URL.
 */
async function uploadFileToServer(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.url) {
        return data.url;
      }
    }
  } catch (err) {
    console.warn('Direct server upload failed, falling back to compressed Data URL:', err);
  }

  // Graceful fallback for serverless or read-only deployments
  return await compressImageToDataUrl(file);
}

export function ImageDropzoneUploader({
  value,
  onChange,
  label = 'Template Image',
  required = true,
}: ImageDropzoneUploaderProps) {
  const [mode, setMode] = useState<'dropzone' | 'url'>('dropzone');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragCounterRef = useRef<number>(0);

  // If a value is provided on mount and it looks like a remote URL, default mode is url if not data/local
  useEffect(() => {
    if (value && !value.startsWith('data:') && !value.startsWith('/uploads/')) {
      // It's an external URL
    }
  }, [value]);

  const handleProcessFile = useCallback(
    async (file: File) => {
      setUploadError(null);

      // Validate image mime type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).');
        return;
      }

      // Check max size: 15MB
      if (file.size > 15 * 1024 * 1024) {
        setUploadError('File is too large. Maximum supported size is 15MB.');
        return;
      }

      setFileName(file.name);
      const sizeKb = (file.size / 1024).toFixed(0);
      setFileSize(`${sizeKb} KB`);
      setIsUploading(true);

      // Instant optimistic local preview
      const localPreview = URL.createObjectURL(file);
      onChange(localPreview);

      try {
        const finalUrl = await uploadFileToServer(file);
        onChange(finalUrl);
        URL.revokeObjectURL(localPreview);
      } catch (err: any) {
        console.error('Upload processing error:', err);
        setUploadError('Failed to process image. Please try again or paste a direct URL.');
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  // Drag & drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current = 0;
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFile = e.dataTransfer.files[0];
        handleProcessFile(droppedFile);
        e.dataTransfer.clearData();
      }
    },
    [handleProcessFile]
  );

  // File input change
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const selectedFile = e.target.files[0];
        handleProcessFile(selectedFile);
      }
    },
    [handleProcessFile]
  );

  // Clipboard paste support inside dropzone area
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
        const pastedFile = e.clipboardData.files[0];
        if (pastedFile.type.startsWith('image/')) {
          e.preventDefault();
          handleProcessFile(pastedFile);
        }
      }
    },
    [handleProcessFile]
  );

  const handleClearImage = useCallback(() => {
    onChange('');
    setFileName(null);
    setFileSize(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);

  return (
    <div className="space-y-2.5" onPaste={handlePaste}>
      {/* Header with Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wide text-slate-700">
          {label} {required && <span className="text-amber-600">*</span>}
        </label>
        <div className="flex items-center rounded-lg bg-slate-100 p-0.5 text-[11px] font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setMode('dropzone')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition ${
              mode === 'dropzone'
                ? 'bg-white font-semibold text-slate-900 shadow-sm'
                : 'hover:text-slate-900'
            }`}
          >
            <UploadCloud className="h-3 w-3" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition ${
              mode === 'url'
                ? 'bg-white font-semibold text-slate-900 shadow-sm'
                : 'hover:text-slate-900'
            }`}
          >
            <Link2 className="h-3 w-3" />
            <span>Image URL</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Mode 1: Drag & Drop Zone */}
      {mode === 'dropzone' && (
        <div>
          {value ? (
            /* Sleek, Compact Image Row when an image is already set */
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm transition hover:border-slate-300">
              <div className="flex items-center gap-3">
                {/* Thumbnail Preview */}
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-900 flex items-center justify-center">
                  <img
                    src={value}
                    alt="Template Preview"
                    className="h-full w-full object-cover"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs text-white">
                      <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                    </div>
                  )}
                </div>

                {/* File info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate text-xs font-bold text-slate-800">
                      {fileName || 'Image Attached'}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400 truncate">
                    {fileSize ? `File size: ${fileSize}` : 'Ready for marketplace preview'}
                  </p>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-100 hover:text-amber-800 transition"
                    title="Replace with another image"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                    <span>Replace</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 shadow-xs hover:bg-rose-100 transition"
                    title="Remove image"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty Dropzone Area */
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 sm:p-5 text-center transition-all duration-200 ${
                isDragging
                  ? 'border-amber-500 bg-amber-50/60 ring-4 ring-amber-500/10 scale-[1.01]'
                  : 'border-slate-200 bg-slate-50/70 hover:border-amber-400 hover:bg-amber-50/20'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center py-3">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                  <p className="mt-2 text-xs font-semibold text-slate-800">Processing image upload...</p>
                  <p className="text-[11px] text-slate-500">Optimizing and storing file</p>
                </div>
              ) : (
                <>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition duration-300 ${
                      isDragging
                        ? 'bg-amber-500 text-white scale-110 shadow-lg shadow-amber-500/30'
                        : 'bg-white text-slate-600 shadow-sm border border-slate-200 group-hover:scale-105 group-hover:text-amber-500 group-hover:border-amber-200'
                    }`}
                  >
                    {isDragging ? (
                      <UploadCloud className="h-5 w-5 animate-bounce" />
                    ) : (
                      <ImageIcon className="h-5 w-5" />
                    )}
                  </div>

                  <p className="mt-2 text-xs font-bold text-slate-800">
                    {isDragging ? (
                      <span className="text-amber-600">Drop your image here right now</span>
                    ) : (
                      <>
                        <span className="text-amber-600 hover:underline">Click to upload</span> or drag and drop
                      </>
                    )}
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Supports PNG, JPG, WEBP, GIF, SVG (up to 15MB)
                  </p>

                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 group-hover:bg-amber-100/60 group-hover:text-amber-800">
                    <FileImage className="h-3 w-3" />
                    <span>Paste image from clipboard (Ctrl+V) also supported</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Direct URL Input */}
      {mode === 'url' && (
        <div className="space-y-3">
          <div className="relative">
            <input
              type="url"
              value={value}
              onChange={(e) => {
                setUploadError(null);
                onChange(e.target.value);
              }}
              placeholder="https://images.pexels.com/... or https://images.unsplash.com/..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 pr-9 text-xs text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white"
            />
            {value && (
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Live Preview if URL is entered (compact row) */}
          {value && (
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs">
              <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-900">
                <img
                  src={value}
                  alt="URL Preview"
                  className="h-full w-full object-cover"
                  onError={() => setUploadError('Could not load image from this URL. Please verify the link.')}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-800 text-xs truncate">URL Image Linked</p>
                <p className="text-[10px] text-slate-400 truncate">{value}</p>
              </div>
              <span className="shrink-0 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                Active
              </span>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          <X className="h-4 w-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
