import Navbar from "./components/Navbar/navbar"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Footer } from "./components/Footer/footer";
import AuthToggle from "./components/Auth/auth";
import { ModelsPage } from "./components/ModelCard/ModelCard";

function App() {
  const NAV_ITEMS = {
    "ABOUT US": "/about",
    "MODELS": "/models",
    "CONTACT": "/contact",
    "DASHBOARD": "/dashboard",
    "WISHLIST": "/wishlist",
    "CART": "/cart",
    "BOOK TEST DRIVE": "/book-test-drive",
  };

 return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Home route */}
        <Route 
          path="/" 
          element={
            <div className="mt-20">
              <AuthToggle/>
            </div>
          }
        />
        
        {/* Models page */}
        <Route path="/models" element={<ModelsPage />} />
        
        {/* Other dynamic routes */}
        {Object.entries(NAV_ITEMS)
          .filter(([label]) => label !== "MODELS")
          .map(([label, href]) => (
            <Route 
              key={label} 
              path={href} 
              element={
                <div className="flex flex-col justify-center items-center min-h-screen">
                  <h1 className="text-3xl font-bold">{label} Page</h1>
                </div>
              } 
            />
          ))}
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App