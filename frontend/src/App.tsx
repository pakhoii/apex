import { ShoppingCartComponent } from "./components/Cart/shoppingCart";
import Navbar from "./components/Navbar/navbar";
import AuthToggle from "./components/Auth/auth";

function App() {
  return (
    <>
      <Navbar />
      <div className="mt-40"></div>
      <AuthToggle />
    </>
  )
}

export default App