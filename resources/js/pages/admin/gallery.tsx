import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, ImageIcon, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageGallery } from '@/components/image-gallery';
import { dashboard as dashboardRoute } from '@/routes';
import admin from '@/routes/admin';
import images from '@/routes/images';
import weddings from '@/routes/weddings';
import type { Wedding } from '@/types';

type Props = {
    wedding: Wedding;
};

export default function AdminGallery({ wedding }: Props) {
    const deleteImage = (id: number) => {
        if (confirm('Delete this image?')) {
            router.delete(images.destroy(id).url);
        }
    };

    const deleteWedding = () => {
        if (confirm('Delete this wedding project and all its images?')) {
            router.delete(weddings.destroy(wedding.id).url, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title={`Gallery - ${wedding.title}`} />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={admin.weddings()}>
                                <ArrowLeft className="size-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">
                                {wedding.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="size-4" />
                                    {new Date(
                                        wedding.event_date,
                                    ).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <User className="size-4" />
                                    {wedding.user?.name}
                                </span>
                                <span className="flex items-center gap-1">
                                    <ImageIcon className="size-4" />
                                    {wedding.images.length} images
                                </span>
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={deleteWedding}
                    >
                        <Trash2 className="mr-2 size-4" />
                        Delete Project
                    </Button>
                </div>

                <ImageGallery
                    images={wedding.images}
                    onDelete={deleteImage}
                />
            </div>
        </>
    );
}

AdminGallery.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboardRoute() },
        { title: 'All Weddings', href: admin.weddings() },
    ],
};
