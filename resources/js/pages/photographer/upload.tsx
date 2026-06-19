import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/file-upload';
import { ImageGallery } from '@/components/image-gallery';
import { dashboard } from '@/routes';
import images from '@/routes/images';
import weddings from '@/routes/weddings';
import type { Wedding } from '@/types';

type Props = {
    wedding: Wedding;
};

export default function UploadImages({ wedding }: Props) {
    const deleteImage = (id: number) => {
        if (confirm('Delete this image?')) {
            router.visit(`/images/${id}`, {
                method: 'delete',
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title={`Upload - ${wedding.title}`} />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={weddings.index()}>
                            <ArrowLeft className="size-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{wedding.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Calendar className="size-4" />
                                {new Date(
                                    wedding.event_date,
                                ).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                                <ImageIcon className="size-4" />
                                {wedding.images.length} images
                            </span>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Upload Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FileUpload
                            route={weddings.images.upload.url(wedding.id)}
                        />
                    </CardContent>
                </Card>

                <div>
                    <h2 className="mb-4 text-lg font-semibold">Gallery</h2>
                    <ImageGallery
                        images={wedding.images}
                        onDelete={deleteImage}
                        bulkDeleteRoute={images.destroyBatch.url()}
                    />
                </div>
            </div>
        </>
    );
}

UploadImages.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'My Weddings', href: weddings.index() },
        { title: 'Upload Images', href: '' },
    ],
};
