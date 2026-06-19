import { Head, router } from '@inertiajs/react';
import { Pagination } from '@/components/ui/pagination';
import { WeddingCard } from '@/components/wedding-card';
import { dashboard as dashboardRoute } from '@/routes';
import admin from '@/routes/admin';
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

export default function AdminWeddings(props: Props) {
    const { weddings: weddingsData } = props;

    const deleteWedding = (id: number) => {
        if (confirm('Delete this wedding project and all its images?')) {
            router.delete(weddings.destroy(id).url);
        }
    };

    return (
        <>
            <Head title="All Weddings" />

            <div className="space-y-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold">All Weddings</h1>
                    <p className="text-sm text-muted-foreground">
                        View all wedding photography projects
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {weddingsData.data.map((wedding) => (
                        <WeddingCard
                            key={wedding.id}
                            wedding={wedding}
                            isAdmin
                            onDelete={deleteWedding}
                        />
                    ))}
                </div>

                {weddingsData.data.length === 0 && (
                    <div className="flex items-center justify-center py-20 text-center">
                        <p className="text-lg text-muted-foreground">
                            No wedding projects found
                        </p>
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

AdminWeddings.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboardRoute() },
        { title: 'All Weddings', href: admin.weddings() },
    ],
};
