export {};

declare global {
    function route(
        name: string,
        params?: Record<string, unknown> | string | number | null,
        absolute?: boolean,
    ): string;
}
