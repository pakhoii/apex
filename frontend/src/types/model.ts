export interface ModelOut {
    id: number;
    name: string;
    price: number;
    year: number;
    amount: number;
    brand_id: number;
    image_url: string | null;
}

export interface ModelCreate {
    name: string;
    price: number;
    year: number;
    amount: number;
    brand_id: number;
    image_url?: string | null;
}

export interface ModelUpdate {
    name?: string | null;
    price?: number | null;
    year?: number | null;
    amount?: number | null;
    brand_id?: number | null;
    image_url?: string | null;
}

export interface ModelFilterParams {
    search?: string | null;
    brand_id?: number | null;
    min_price?: number | null;
    max_price?: number | null;
    min_year?: number | null;
    max_year?: number | null;
}

export interface PaginationParams {
    skip?: number;
    limit?: number;
}

export interface PagedModelResponse {
    rows: ModelOut[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface ModelCompareParams {
    model_ids: number[];
}

export interface ModelCompareResponse {
    models: ModelOut[];
}

// Props
export interface GalleryProps {
    models ?: ModelOut[];
}

export interface CompareProps {
    modelIds: number[];
}

export interface ModelDetailsProps {
    modelId: number;
}