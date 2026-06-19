import { ChevronLeft, ChevronRight, Trash2, X } from 'lucide-react';
import { useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
} from '@/components/ui/dialog';
import type { Image } from '@/types';

type ImageModalProps = {
    images: Image[];
    selectedIndex: number;
    onNavigate: (index: number) => void;
    onClose: () => void;
    onDelete?: (id: number) => void;
};

export function ImageModal({ images, selectedIndex, onNavigate, onClose, onDelete }: ImageModalProps) {
    const image = images[selectedIndex];
    const hasPrev = selectedIndex > 0;
    const hasNext = selectedIndex < images.length - 1;

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft' && hasPrev) {
            onNavigate(selectedIndex - 1);
        } else if (e.key === 'ArrowRight' && hasNext) {
            onNavigate(selectedIndex + 1);
        }
    }, [hasPrev, hasNext, selectedIndex, onNavigate]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleDelete = () => {
        if (image && onDelete) {
            onDelete(image.id);
            onClose();
        }
    };

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[98vw] border-none bg-black/95 p-0">
                <div className="flex items-center justify-between px-3 pt-3">
                    <span className="text-sm text-white/60">
                        {selectedIndex + 1} / {images.length}
                    </span>
                    <div className="flex items-center gap-3">
                        {onDelete && image && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1.5 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                                onClick={handleDelete}
                            >
                                <Trash2 className="size-4" />
                                Delete
                            </Button>
                        )}
                        <DialogClose asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white/70 hover:bg-white/10 hover:text-white"
                            >
                                <X className="size-5" />
                            </Button>
                        </DialogClose>
                    </div>
                </div>

                <div className="relative flex items-center px-1 pb-1">
                    {hasPrev && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 z-10 size-12 rounded-full bg-black/50 text-white hover:bg-black/70"
                            onClick={() => onNavigate(selectedIndex - 1)}
                        >
                            <ChevronLeft className="size-7" />
                        </Button>
                    )}

                    {image && (
                        <img
                            src={`/storage/${image.image_path}`}
                            alt="Wedding photo"
                            className="mx-auto max-h-[90vh] w-full object-contain"
                        />
                    )}

                    {hasNext && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 z-10 size-12 rounded-full bg-black/50 text-white hover:bg-black/70"
                            onClick={() => onNavigate(selectedIndex + 1)}
                        >
                            <ChevronRight className="size-7" />
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
