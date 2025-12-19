import { ShoppingCartComponent } from "@/components/Cart/shoppingCart";

import "./myCart.css";

export default function MyCart() {
    return (
        <div className="my-cart-page">
            <h1 className="title">My Cart</h1>
            <hr />
            <ShoppingCartComponent />
        </div>
    )
}