import { Footer } from "./components/Footer/footer";
import Navbar from "./components/Navbar/navbar";
import AboutPage from "./pages/About/about";

import ModelsPage from "./pages/Models/models";

function App() {
  return (
    <>
      <Navbar />
      {/* <div className="mt-40"></div> */}
      <ModelsPage />
      <Footer/>
    </>
  )
}

export default App