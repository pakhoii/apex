import Navbar from "./components/Navbar/navbar";
import { ModelCard } from "./components/ModelCard/ModelCard";

function App() {
  return (
    <>
      <Navbar />
      <div className="mt-20 flex justify-center">
        <ModelCard
          modelName="Range Rover Velar"
          year={2024}
          price={60000}
          imageDefault="./image/cars/Velar.jpg"
          imageHover="./image/cars/Velar-Hover.jpg"
          onBuildYourOwn={() => console.log('Build clicked')}
          onFindOutMore={() => console.log('Learn more')}
        />
      </div>
    </>
  );
}

export default App;