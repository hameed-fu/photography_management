import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { login } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col lg:flex">
                <img
                    src="/file-store.jpg"
                    alt="Wedding photography"
                    className="absolute inset-0 size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                <div className="relative z-10 flex h-full flex-col p-10">
                    <Link
                        href={login()}
                        className="flex items-center text-lg font-medium text-white"
                    >
                        <AppLogoIcon className="mr-2 size-8 fill-current text-white" />
                        <span className="text-white/90">Wedding Photos</span>
                    </Link>
                    <div className="mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg text-white/90">
                                Capturing your most precious moments, preserving
                                them forever.
                            </p>
                            <footer className="text-sm text-white/60">
                                Wedding Photography Platform
                            </footer>
                        </blockquote>
                    </div>
                </div>
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link
                        href={login()}
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        <AppLogoIcon className="h-10 fill-current text-black sm:h-12 dark:text-white" />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
