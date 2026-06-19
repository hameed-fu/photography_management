import { Head, useForm } from '@inertiajs/react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';
import weddings from '@/routes/weddings';

export default function CreateWedding() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        event_date: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(weddings.store().url);
    };

    return (
        <>
            <Head title="Create Wedding" />

            <div className="mx-auto max-w-2xl p-4 md:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>New Wedding Project</CardTitle>
                        <CardDescription>
                            Create a new wedding project to start uploading
                            photos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Wedding Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. John & Sarah Wedding"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="event_date">Event Date</Label>
                                <div className="relative">
                                    <CalendarIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="event_date"
                                        type="date"
                                        className="pl-10"
                                        value={data.event_date}
                                        onChange={(e) =>
                                            setData(
                                                'event_date',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                {errors.event_date && (
                                    <p className="text-sm text-destructive">
                                        {errors.event_date}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? 'Creating...'
                                        : 'Create Project'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CreateWedding.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'My Weddings', href: weddings.index() },
        { title: 'Create Wedding', href: weddings.create() },
    ],
};
