export interface BrandOut {
    id: number;
    name: string;
    logo_url: string | null;
}

export interface BrandCreate {
    name: string;
    logo_url?: string | null;
}

export interface BrandUpdate {
    name?: string | null;
    logo_url?: string | null;
}
