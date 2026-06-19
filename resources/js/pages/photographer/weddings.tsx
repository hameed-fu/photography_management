import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { WeddingCard } from '@/components/wedding-card';
import { dashboard } from '@/routes';
import weddings from '@/routes/weddings';
import type { Wedding } from '@/types';

type Props = {
    weddings: {
        data: Wedding[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
};

export default function PhotographerWeddings(props: Props) {
    const { weddings: weddingsData } = props;

    const deleteWedding = (id: number) => {
        if (confirm('Delete this wedding project and all its images?')) {
            router.delete(weddings.destroy(id).url);
        }
    };

    return (
        <>
            <Head title="My Weddings" />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">My Weddings</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your wedding photography projects
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={weddings.create()}>
                            <Plus className="mr-2 size-4" />
                            New Wedding
                        </Link>
                    </Button>
                </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {weddingsData.data.map((wedding) => (
                    <WeddingCard
                        key={wedding.id}
                        wedding={wedding}
                        onDelete={deleteWedding}
                    />
                ))}
            </div>

            {weddingsData.data.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-lg text-muted-foreground">
                        No wedding projects yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Create your first wedding project to start uploading
                        photos
                    </p>
                    <Button asChild className="mt-4">
                        <Link href={weddings.create()}>
                            <Plus className="mr-2 size-4" />
                            Create Wedding
                        </Link>
                    </Button>
                </div>
            )}

                {weddingsData.last_page > 1 && (
                    <div className="mt-6">
                        <Pagination
                            currentPage={weddingsData.current_page}
                            lastPage={weddingsData.last_page}
                            links={weddingsData.links}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

PhotographerWeddings.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'My Weddings', href: weddings.index() },
    ],
};
