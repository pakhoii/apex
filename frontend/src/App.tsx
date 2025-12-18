import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/navbar";
import ComparePage from "./pages/Compare/compare";
import { Footer } from "./components/Footer/footer";
import AboutPage from "./pages/About/about";


function App() {
  return (
    <>
      <Navbar />
      {/* <div className="mt-40"></div> */}
      <ComparePage />
      <AboutPage/>
      <Footer />
    </>
  )
}

export default App