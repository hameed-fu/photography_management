import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginationProps = {
    currentPage: number;
    lastPage: number;
    links: PaginationLink[];
};

export function Pagination({ currentPage, lastPage, links }: PaginationProps) {
    if (lastPage <= 1) return null;

    const visibleLinks = links.filter(
        (link) =>
            !isNaN(Number(link.label)) ||
            link.label.includes('Previous') ||
            link.label.includes('Next'),
    );

    return (
        <div className="flex items-center justify-center gap-1">
            {links[0] && (() => {
                const url = links[0].url;
                return (
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={!url}
                        asChild
                    >
                        {url ? (
                            <Link href={url} preserveScroll>
                                <ChevronLeft className="size-4" />
                            </Link>
                        ) : (
                            <span>
                                <ChevronLeft className="size-4" />
                            </span>
                        )}
                    </Button>
                );
            })()}

            {visibleLinks.map((link, i) => {
                if (!link.url) {
                    return (
                        <Button
                            key={i}
                            variant="outline"
                            size="icon"
                            disabled
                        >
                            <span className="text-xs">{link.label}</span>
                        </Button>
                    );
                }

                return (
                    <Button
                        key={i}
                        variant={link.active ? 'default' : 'outline'}
                        size="icon"
                        asChild
                    >
                        <Link href={link.url} preserveScroll>
                            <span className="text-xs">{link.label}</span>
                        </Link>
                    </Button>
                );
            })}

            {links[links.length - 1] && (() => {
                const url = links[links.length - 1].url;
                return (
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={!url}
                        asChild
                    >
                        {url ? (
                            <Link href={url} preserveScroll>
                                <ChevronRight className="size-4" />
                            </Link>
                        ) : (
                            <span>
                                <ChevronRight className="size-4" />
                            </span>
                        )}
                    </Button>
                );
            })()}
        </div>
    );
}
