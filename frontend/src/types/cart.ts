export interface CartItem {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    imageUrl: string;
}

export interface CartItemProps {
    item: CartItem;
    onIncrease: (id: string) => void
    onDecrease: (id: string) => void
    onRemove: (id: string) => void
}

export interface CartItemCreate {
    model_id: number;
    quantity: number;
}

export interface CartItemUpdate {
    quantity: number;
}