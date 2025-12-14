import { Button } from "./components/ui/button"
import { Footer } from "./components/Footer/footer"

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col justify-center items-center flex-1">
        <h1 className="text-4xl">APEX</h1>
        <p className="mt-2 text-lg text-gray-700">Web Application Development Project</p>
        <Button className="mt-4">Get Started</Button>
      </div>
      < Footer />  
    </div>
  )
}

export default App