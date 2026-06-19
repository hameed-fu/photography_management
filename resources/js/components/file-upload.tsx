import { router } from '@inertiajs/react';
import { AlertCircle, ImagePlus, Loader2, Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

type FileUploadProps = {
    route: string;
};

export function FileUpload({ route }: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        if (uploading) return;
        setError(null);
        const dropped = Array.from(e.dataTransfer.files).filter((f) =>
            f.type.startsWith('image/'),
        );
        setFiles((prev) => [...prev, ...dropped]);
    }, [uploading]);

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && !uploading) {
            setError(null);
            setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (index: number) => {
        if (uploading) return;
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const uploadFiles = async () => {
        if (files.length === 0 || uploading) return;

        const filesToUpload = [...files];
        const total = filesToUpload.length;
        setUploading(true);
        setUploadProgress({ current: 0, total });
        setError(null);
        const errors: string[] = [];

        for (let i = 0; i < total; i++) {
            const formData = new FormData();
            formData.append('images[]', filesToUpload[i]);

            await new Promise<void>((resolve) => {
                router.post(route, formData, {
                    preserveScroll: true,
                    preserveState: true,
                    onError: (errs) => {
                        const messages = Object.values(errs).flat();
                        errors.push(`${filesToUpload[i].name}: ${messages.join(', ')}`);
                    },
                    onFinish: () => {
                        setUploadProgress({ current: i + 1, total });
                        resolve();
                    },
                });
            });
        }

        if (errors.length > 0) {
            setError(errors.join(' | '));
        }

        if (errors.length < total) {
            setFiles([]);
        }

        setUploading(false);
    };

    return (
        <div className="space-y-4">
            <Card
                className={`border-2 border-dashed transition-colors ${
                    dragOver
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25'
                } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
            >
                <CardContent className="flex flex-col items-center justify-center gap-4  ">
                    <div className="rounded-full bg-muted p-4">
                        <ImagePlus className="size-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium">
                            Drag & drop images here
                        </p>
                        <p className="text-xs text-muted-foreground">
                            or click to browse (JPEG, PNG, WebP - max 10MB each)
                        </p>
                    </div>
                    <label>
                        <Button variant="outline" type="button" asChild disabled={uploading}>
                            <span className="cursor-pointer">Browse Files</span>
                        </Button>
                        <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                            className="hidden"
                            onChange={onFileSelect}
                            disabled={uploading}
                        />
                    </label>
                </CardContent>
            </Card>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {files.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                            {uploading
                                ? `Uploading ${uploadProgress.current} of ${uploadProgress.total}...`
                                : `${files.length} file(s) selected`}
                        </p>
                        <Button
                            onClick={uploadFiles}
                            disabled={uploading}
                            size="sm"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 size-4" />
                                    Upload
                                </>
                            )}
                        </Button>
                    </div>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                        {files.map((file, index) => (
                            <div key={index} className="group relative">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="aspect-square rounded-md object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    disabled={uploading}
                                    className="absolute right-1 top-1 rounded-full bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-0"
                                >
                                    <X className="size-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
