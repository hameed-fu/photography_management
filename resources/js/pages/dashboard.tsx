import { Head, usePage } from '@inertiajs/react';
import { Calendar, ImageIcon, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import type { Auth, Wedding, WeddingStats } from '@/types';

type Props = {
    stats: WeddingStats;
    recentWeddings: Wedding[];
};

export default function Dashboard({ stats, recentWeddings }: Props) {
    const { auth } = usePage().props as unknown as { auth: Auth };
    const isAdmin = auth.user.role === 'admin';

    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">
                        Welcome to your photography dashboard
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                {isAdmin ? 'Total Weddings' : 'My Weddings'}
                            </CardTitle>
                            <Calendar className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                {stats.total_weddings}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                {isAdmin ? 'Total Images' : 'My Images'}
                            </CardTitle>
                            <ImageIcon className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                {stats.total_images}
                            </p>
                        </CardContent>
                    </Card>
                    {isAdmin && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Photographers
                                </CardTitle>
                                <Users className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">
                                    {stats.total_photographers}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Weddings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentWeddings.map((wedding) => (
                                <div
                                    key={wedding.id}
                                    className="flex items-center justify-between rounded-lg border p-4"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {wedding.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(
                                                wedding.event_date,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {recentWeddings.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    No weddings yet.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
