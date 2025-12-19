import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/navbar";
import { Footer } from "./components/Footer/footer";
import Landing from "./pages/Landing/landing";
import MyCart from "./pages/MyCart/myCart";
import AuthPage from "./pages/Auth/auth";

import ModelsPage from "./pages/Models/models";

function App() {
  return (
    <>
      <Navbar />
      {/* <Landing /> */}
      <AuthPage />
      <MyCart />
      {/* <Footer /> */}
    </>
  )
}

export default App