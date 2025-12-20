import { ShoppingCartComponent } from "@/components/Cart/shoppingCart";
import Navbar from "@/components/Navbar/navbar";
import "./myCart.css";

export default function MyCart() {
    return (
        <>
            <Navbar />
            <div className="my-cart-page">
                <h1 className="title">My Cart</h1>
                <hr />
                <ShoppingCartComponent />
            </div>
        </>
    )
}