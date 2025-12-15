import { ShoppingCartComponent } from "./components/Cart/shoppingCart";
import Navbar from "./components/Navbar/navbar";

function App() {
  return (
    <>
      <Navbar />
      <div className="mt-40"></div>
      <ShoppingCartComponent/>
    </>
  )
}

export default App