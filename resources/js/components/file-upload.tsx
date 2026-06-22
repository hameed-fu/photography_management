import { router } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    ImagePlus,
    Loader2,
    RefreshCw,
    X,
    XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type FileStatus = 'pending' | 'uploading' | 'uploaded' | 'failed' | 'cancelled';

type FileItem = {
    id: string;
    file: File;
    status: FileStatus;
    progress: number;
    error?: string;
};

type FileUploadProps = {
    route: string;
};

let nextId = 0;
const getNextId = () => `file-${++nextId}`;

export function FileUpload({ route }: FileUploadProps) {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const cancelRef = useRef<(() => void) | null>(null);
    const filesRef = useRef(files);
    filesRef.current = files;

    const updateFile = (id: string, updates: Partial<FileItem>) => {
        setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    };

    const uploadFiles = useCallback(async () => {
        const pending = filesRef.current.filter((f) => f.status === 'pending');
        if (pending.length === 0 || uploading) return;

        setUploading(true);
        setError(null);

        for (const fileItem of pending) {
            const current = filesRef.current.find((f) => f.id === fileItem.id);
            if (!current || current.status === 'cancelled') continue;

            updateFile(fileItem.id, { status: 'uploading', progress: 0 });

            const formData = new FormData();
            formData.append('images[]', fileItem.file);

            await new Promise<void>((resolve) => {
                router.post(route, formData, {
                    preserveScroll: true,
                    preserveState: true,
                    onProgress: (ev) => {
                        if (!ev) return;
                        const pct =
                            ev.percentage ??
                            Math.round((ev.loaded / (ev.total || 1)) * 100);
                        updateFile(fileItem.id, { progress: pct });
                    },
                    onCancelToken: (token) => {
                        cancelRef.current = token.cancel;
                    },
                    onCancel: () => {
                        cancelRef.current = null;
                        updateFile(fileItem.id, { status: 'cancelled' });
                    },
                    onError: (errs) => {
                        cancelRef.current = null;
                        const messages = Object.values(errs).flat();
                        updateFile(fileItem.id, {
                            status: 'failed',
                            error: messages.join(', '),
                        });
                    },
                    onFinish: () => {
                        cancelRef.current = null;
                        setFiles((prev) => {
                            const current = prev.find(
                                (f) => f.id === fileItem.id,
                            );
                            if (
                                current &&
                                (current.status === 'uploading' ||
                                    current.status === 'pending')
                            ) {
                                return prev.map((f) =>
                                    f.id === fileItem.id
                                        ? {
                                              ...f,
                                              status: 'uploaded' as FileStatus,
                                              progress: 100,
                                          }
                                        : f,
                                );
                            }
                            return prev;
                        });
                        resolve();
                    },
                });
            });
        }

        setUploading(false);
    }, [route, uploading]);

    useEffect(() => {
        if (
            !uploading &&
            files.some((f) => f.status === 'pending') &&
            files.some((f) => f.status === 'uploading') === false
        ) {
            uploadFiles();
        }
    }, [files, uploading, uploadFiles]);

    const enqueueFiles = useCallback(
        (newFiles: File[]) => {
            if (uploading) return;
            setError(null);
            const items: FileItem[] = newFiles.map((f) => ({
                id: getNextId(),
                file: f,
                status: 'pending' as FileStatus,
                progress: 0,
            }));
            setFiles((prev) => [...prev, ...items]);
        },
        [uploading],
    );

    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            enqueueFiles(Array.from(e.dataTransfer.files));
        },
        [enqueueFiles],
    );

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            enqueueFiles(Array.from(selectedFiles));
        }
        e.target.value = '';
    };

    const removeFile = (id: string) => {
        if (uploading) return;
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    const cancelUpload = () => {
        cancelRef.current?.();
        cancelRef.current = null;
    };

    const retryFile = (id: string) => {
        updateFile(id, { status: 'pending', progress: 0, error: undefined });
        if (!uploading) {
            uploadFiles();
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const statusIcon = (status: FileStatus) => {
        switch (status) {
            case 'pending':
                return <Clock className="size-3 text-muted-foreground" />;
            case 'uploading':
                return (
                    <Loader2 className="size-3 animate-spin text-white" />
                );
            case 'uploaded':
                return <CheckCircle2 className="size-3 text-green-500" />;
            case 'failed':
                return <XCircle className="size-3 text-destructive" />;
            case 'cancelled':
                return <XCircle className="size-3 text-muted-foreground" />;
        }
    };

    const doneCount = {
        uploaded: files.filter((f) => f.status === 'uploaded').length,
        failed: files.filter((f) => f.status === 'failed').length,
        cancelled: files.filter((f) => f.status === 'cancelled').length,
    };
    const totalDone = doneCount.uploaded + doneCount.failed + doneCount.cancelled;
    const allDone = !uploading && files.length > 0 && totalDone === files.length;

    const statusLabel = (status: FileStatus) => {
        switch (status) {
            case 'pending': return 'Pending';
            case 'uploading': return 'Uploading';
            case 'uploaded': return 'Uploaded';
            case 'failed': return 'Failed';
            case 'cancelled': return 'Cancelled';
        }
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
                <CardContent className="flex flex-col items-center justify-center gap-4 pt-6">
                    <div className="rounded-full bg-muted p-4">
                        <ImagePlus className="size-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium">
                            Drag & drop images here
                        </p>
                        <p className="text-xs text-muted-foreground">
                            or click to browse (JPEG, PNG, WebP, RAW, and more -
                            max 200MB each)
                        </p>
                    </div>
                    <label>
                        <Button
                            variant="outline"
                            type="button"
                            asChild
                            disabled={uploading}
                        >
                            <span className="cursor-pointer">
                                Browse Files
                            </span>
                        </Button>
                        <input
                            type="file"
                            multiple
                            accept="image/*,.nef,.cr2,.cr3,.arw,.dng,.orf,.rw2,.raf,.pef,.srw,.tif,.tiff,.bmp,.heic,.heif,.psd"
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
                    {allDone && (
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                                {doneCount.uploaded > 0 && `${doneCount.uploaded} uploaded`}
                                {doneCount.failed > 0 && `${doneCount.uploaded > 0 ? ', ' : ''}${doneCount.failed} failed`}
                                {doneCount.cancelled > 0 && `${doneCount.uploaded + doneCount.failed > 0 ? ', ' : ''}${doneCount.cancelled} cancelled`}
                                {doneCount.failed === 0 && doneCount.cancelled === 0 && ' — all uploaded'}
                            </p>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFiles([])}
                            >
                                Clear all
                            </Button>
                        </div>
                    )}
                    <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                    {files.map((item) => (
                        <div key={item.id} className="group relative">
                            <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                                <img
                                    src={URL.createObjectURL(item.file)}
                                    alt={item.file.name}
                                    className="size-full object-cover"
                                />

                                {(item.status === 'uploading' ||
                                    item.status === 'pending') && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-background/60">
                                        <div
                                            className="h-full bg-primary transition-all"
                                            style={{
                                                width: `${item.progress}%`,
                                            }}
                                        />
                                    </div>
                                )}

                                {item.status === 'uploading' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <div className="text-center">
                                            <Loader2 className="mx-auto size-4 animate-spin text-white" />
                                            <span className="mt-0.5 block text-[10px] font-medium text-white">
                                                {item.progress}%
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {(item.status === 'uploaded' ||
                                    item.status === 'failed' ||
                                    item.status === 'cancelled') && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                        <div className="text-center">
                                            <div className="mx-auto">
                                                {statusIcon(item.status)}
                                            </div>
                                            <span
                                                className={`mt-0.5 block text-[10px] font-medium ${
                                                    item.status === 'uploaded'
                                                        ? 'text-green-600'
                                                        : item.status ===
                                                            'failed'
                                                          ? 'text-destructive'
                                                          : 'text-muted-foreground'
                                                }`}
                                            >
                                                {statusLabel(item.status)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-0.5">
                                <p className="truncate text-[10px] text-muted-foreground">
                                    {item.file.name}
                                </p>
                                <p className="text-[9px] text-muted-foreground/60">
                                    {formatSize(item.file.size)}
                                </p>
                            </div>

                            {item.status === 'failed' && item.error && (
                                <p className="mt-0.5 truncate text-[10px] text-destructive">
                                    {item.error}
                                </p>
                            )}

                            <div className="absolute right-1 top-1 flex gap-0.5">
                                {item.status === 'pending' && !uploading && (
                                    <button
                                        type="button"
                                        onClick={() => removeFile(item.id)}
                                        className="rounded-full bg-background/80 p-1 text-muted-foreground opacity-0 hover:bg-background group-hover:opacity-100"
                                    >
                                        <X className="size-3" />
                                    </button>
                                )}

                                {item.status === 'uploading' && (
                                    <button
                                        type="button"
                                        onClick={cancelUpload}
                                        className="rounded-full bg-background/80 p-1 text-destructive"
                                        title="Cancel"
                                    >
                                        <X className="size-3" />
                                    </button>
                                )}

                                {item.status === 'failed' && !uploading && (
                                    <button
                                        type="button"
                                        onClick={() => retryFile(item.id)}
                                        className="rounded-full bg-background/80 p-1 text-muted-foreground opacity-0 hover:bg-background group-hover:opacity-100"
                                        title="Retry"
                                    >
                                        <RefreshCw className="size-3" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                </div>
            )}
        </div>
    );
}
