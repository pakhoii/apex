import type { CartItemProps } from "@/types/cart";
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card";

export default function CartItemComponent(
    { item, onIncrease, onDecrease, onRemove }: CartItemProps
) {
    return (
        <Card className="item-card">
            <div className="item-details">
                {/* Item's image */}
                <div className="image-container">
                    <img src={item.imageUrl}
                        alt="Item Image" 
                        className="item-image" />
                </div>

                {/* Item's info */}
                <div className="info-container">
                    <h3>{item.name}</h3>
                    <p className="item-price">
                        Unit Price: ${
                            item.unitPrice.toFixed(3).toLocaleString()
                        }
                    </p>
                </div>

                {/* Item's quantity controls */}
                <div className="quantity-controls">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => onDecrease(item.id)}
                    >
                        <Minus size={16} />
                    </Button>
                    <span className="quantity-display">{item.quantity}</span>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => onIncrease(item.id)}
                    >
                        <Plus size={16} />
                    </Button>
                </div>
                
                {/* Remove item button */}
                <div className="remove-item">
                    <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => onRemove(item.id)}
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            </div>
        </Card>    
    )
}