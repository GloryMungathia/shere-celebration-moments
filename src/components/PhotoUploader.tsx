import { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import { photoFileError, resizePhoto } from '@/lib/image';

interface PhotoUploaderProps {
  photoUrl: string | null;
  onPhotoChange: (url: string | null) => void;
}

export default function PhotoUploader({
  photoUrl,
  onPhotoChange,
}: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setError(null);
    const problem = photoFileError(file);
    if (problem) {
      setError(problem);
      return;
    }
    setUploading(true);
    try {
      onPhotoChange(await resizePhoto(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) handleUpload(file);
  };

  const handleRemove = () => {
    onPhotoChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  if (photoUrl) {
    return (
      <div className="space-y-3">
        <div className="relative rounded-xl overflow-hidden border border-stone-200">
          <img src={photoUrl} alt="Preview" className="w-full h-40 object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove photo"
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => inputRef.current?.click()}>
          <Upload className="w-4 h-4" />
          Replace Photo
        </Button>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} data-testid="photo-input" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full rounded-xl border-2 border-dashed border-stone-300 hover:border-rose-400 hover:bg-rose-50/50 transition-colors p-8 text-center"
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Spinner />
            <p className="text-sm text-stone-500">Adding photo...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-stone-400" />
            </div>
            <p className="text-sm font-medium text-stone-600">Upload a photo</p>
            <p className="text-xs text-stone-400">JPG, PNG or WebP up to 10MB</p>
          </div>
        )}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} data-testid="photo-input" />
    </div>
  );
}
