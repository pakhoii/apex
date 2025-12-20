import Navbar from "./components/Navbar/navbar";
import TestDrive from "./pages/TestDrive/testDrive";

function App() {
  return (
    <>
      <Navbar />
      <TestDrive modelId={1} name="Sample Model" imageUrl="/images/silver-porsche-911-turbo-s-luxury-sports-car.jpg" />
    </>
  )
}

export default App