export type Wedding = {
    id: number;
    title: string;
    event_date: string;
    user_id: number;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    images: Image[];
    images_count?: number;
    created_at: string;
    updated_at: string;
};

export type Image = {
    id: number;
    wedding_id: number;
    image_path: string;
    url: string;
    thumbnail: string;
    created_at: string;
    updated_at: string;
};

export type WeddingStats = {
    total_weddings: number;
    total_images: number;
    total_photographers: number;
};
