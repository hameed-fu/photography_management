import { Link } from '@inertiajs/react';
import { Calendar, ImageIcon, Trash2, Upload, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import admin from '@/routes/admin';
import weddings from '@/routes/weddings';
import type { Wedding } from '@/types';

const avatarColors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
    'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
    'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
    'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500',
    'bg-rose-500',
];

function getInitials(title: string): string {
    return title
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 3);
}

function getColor(id: number): string {
    return avatarColors[id % avatarColors.length];
}

type WeddingCardProps = {
    wedding: Wedding;
    isAdmin?: boolean;
    onDelete?: (id: number) => void;
};

export function WeddingCard({ wedding, isAdmin, onDelete }: WeddingCardProps) {
    const initials = getInitials(wedding.title);
    const color = getColor(wedding.id);

    return (
        <Card className="overflow-hidden transition-shadow hover:shadow-md py-0 pb-4">
            <Link
                href={
                    isAdmin
                        ? admin.weddings.show(wedding.id)
                        : weddings.upload(wedding.id)
                }
            >
                <div className={`flex h-32 items-center justify-center ${color}`}>
                    <Avatar className="size-16">
                        <AvatarFallback className="bg-white/20 text-2xl font-bold text-white">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </Link>
            <CardHeader className="pb-1 pt-3">
                <CardTitle className="text-sm">{wedding.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 pb-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    <span>{new Date(wedding.event_date).toLocaleDateString()}</span>
                </div>
                {wedding.user && (
                    <div className="flex items-center gap-1.5">
                        <User className="size-3.5" />
                        <span>{wedding.user.name}</span>
                    </div>
                )}
                <div className="flex items-center gap-1.5">
                    <ImageIcon className="size-3.5" />
                    <span>{wedding.images?.length ?? 0} images</span>
                </div>
            </CardContent>
            <CardFooter className="gap-2">
                {!isAdmin && (
                    <Button size="sm" variant="outline" asChild className="flex-1">
                        <Link href={weddings.upload(wedding.id)}>
                            <Upload className="mr-2 size-4" />
                            Upload
                        </Link>
                    </Button>
                )}
                {isAdmin && (
                    <Button size="sm" variant="outline" asChild className="flex-1">
                        <Link href={admin.weddings.show(wedding.id)}>
                            <ImageIcon className="mr-2 size-4" />
                            View Gallery
                        </Link>
                    </Button>
                )}
                {onDelete && (
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(wedding.id)}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
