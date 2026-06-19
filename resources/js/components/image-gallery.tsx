import { router } from '@inertiajs/react';
import { Check, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImageModal } from '@/components/image-modal';
import type { Image } from '@/types';

type ImageGalleryProps = {
    images: Image[];
    onDelete?: (id: number) => void;
    bulkDeleteRoute?: string;
};

export function ImageGallery({ images, onDelete, bulkDeleteRoute }: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [selectMode, setSelectMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [deleting, setDeleting] = useState(false);

    if (images.length === 0) {
        return (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
                <p>No images uploaded yet.</p>
            </div>
        );
    }

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const enterSelectMode = () => {
        setSelectMode(true);
        setSelectedIds(new Set());
    };

    const exitSelectMode = () => {
        setSelectMode(false);
        setSelectedIds(new Set());
    };

    const handleBulkDelete = () => {
        if (selectedIds.size === 0 || !bulkDeleteRoute) return;
        if (!confirm(`Delete ${selectedIds.size} image(s)?`)) return;

        setDeleting(true);
        router.post(bulkDeleteRoute, { ids: Array.from(selectedIds) }, {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                exitSelectMode();
            },
        });
    };

    const isAllSelected = selectedIds.size === images.length;
    const toggleAll = () => {
        if (isAllSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(images.map((img) => img.id)));
        }
    };

    return (
        <>
            <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {images.length} image{images.length !== 1 ? 's' : ''}
                </p>
                {!selectMode ? (
                    <Button variant="outline" size="sm" onClick={enterSelectMode}>
                        Select
                    </Button>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={toggleAll}>
                            {isAllSelected ? 'Deselect All' : 'Select All'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={exitSelectMode}>
                            <X className="mr-1 size-3" />
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={selectedIds.size === 0 || deleting}
                            onClick={handleBulkDelete}
                        >
                            <Trash2 className="mr-1 size-3" />
                            {deleting ? 'Deleting...' : `Delete (${selectedIds.size})`}
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                {images.map((image, index) => {
                    const isSelected = selectedIds.has(image.id);
                    return (
                        <div key={image.id} className="group relative">
                            {selectMode ? (
                                <button
                                    type="button"
                                    onClick={() => toggleSelect(image.id)}
                                    className="w-full"
                                >
                                    <div className="relative">
                                        <img
                                            src={`/storage/${image.image_path}`}
                                            alt="Wedding photo"
                                            className={`aspect-square w-full rounded-lg object-cover transition-all ${
                                                isSelected ? 'ring-2 ring-primary opacity-80' : ''
                                            }`}
                                        />
                                        <div
                                            className={`absolute right-2 top-2 flex size-6 items-center justify-center rounded-full border-2 transition-colors ${
                                                isSelected
                                                    ? 'border-primary bg-primary text-primary-foreground'
                                                    : 'border-white/80 bg-black/40'
                                            }`}
                                        >
                                            {isSelected && <Check className="size-4" />}
                                        </div>
                                    </div>
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setSelectedIndex(index)}
                                    className="w-full"
                                >
                                    <img
                                        src={`/storage/${image.image_path}`}
                                        alt="Wedding photo"
                                        className="aspect-square w-full rounded-lg border object-fit transition-transform group-hover:scale-105"
                                    />
                                </button>
                            )}
                            {!selectMode && onDelete && (
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    className="absolute right-2 top-2 size-8 opacity-0 transition-opacity group-hover:opacity-100"
                                    onClick={() => onDelete(image.id)}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>

            {selectedIndex !== null && !selectMode && (
                <ImageModal
                    images={images}
                    selectedIndex={selectedIndex}
                    onNavigate={setSelectedIndex}
                    onClose={() => setSelectedIndex(null)}
                    onDelete={onDelete}
                />
            )}
        </>
    );
}
