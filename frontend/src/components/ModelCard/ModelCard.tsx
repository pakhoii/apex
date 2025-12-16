import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import './ModelCard.css';

interface ModelCardProps {
  modelName: string;
  year: string | number;
  price: number;
  imageDefault: string;
  imageHover: string;
  onBuildYourOwn?: () => void;
  onFindOutMore?: () => void;
}

// Models data
const MODELS_DATA = [
  {
    modelName: "Range Rover Velar",
    year: 2025,
    price: 50000,
    imageDefault: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&auto=format&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1617531653520-bd788c6823dd?w=800&auto=format&fit=crop",
  },
  {
    modelName: "Range Rover Sport",
    year: 2025,
    price: 75000,
    imageDefault: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&auto=format&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1617531653520-bd788c6823dd?w=800&auto=format&fit=crop",
  },
  {
    modelName: "Range Rover Evoque",
    year: 2025,
    price: 45000,
    imageDefault: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&auto=format&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1617531653520-bd788c6823dd?w=800&auto=format&fit=crop",
  },
];

export function ModelCard({
  modelName,
  year,
  price,
  imageDefault,
  imageHover,
  onBuildYourOwn,
  onFindOutMore,
}: ModelCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="model-card-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="model-card relative overflow-hidden border-0 shadow-lg">
        {/* Default View */}
        <div
          className={`model-card-default absolute inset-0 transition-opacity duration-500 ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="model-card-content flex flex-col items-center justify-center h-full p-8">
            <div className="text-center mb-8 z-10">
              <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                {modelName} {year}
              </h2>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Start from {price.toLocaleString('en-US')} USD
              </p>
            </div>
            <div className="model-card-image-wrapper w-full flex items-center justify-center">
              <img
                src={imageDefault}
                alt={`${modelName} ${year}`}
                className="model-card-image object-contain w-full h-auto"
              />
            </div>
          </div>
          <div className="model-card-background" />
        </div>

        {/* Hover View */}
        <div
          className={`model-card-hover absolute inset-0 transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="model-card-content flex flex-col h-full p-8">
            <div className="text-center mb-6 z-10">
              <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                {modelName} {year}
              </h2>
              <p className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Start from {price.toLocaleString('en-US')} USD
              </p>
              <Button
                onClick={onBuildYourOwn}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2"
              >
                Build your own
              </Button>
            </div>
            <div className="model-card-image-wrapper flex-1 flex items-center justify-center">
              <img
                src={imageHover}
                alt={`${modelName} ${year} front view`}
                className="model-card-image object-contain w-full h-auto"
              />
            </div>
            <div className="text-center mt-auto z-10">
              <button
                onClick={onFindOutMore}
                className="text-gray-900 dark:text-white underline hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                Find out more
              </button>
            </div>
          </div>
          <div className="model-card-background" />
        </div>
      </Card>
    </div>
  );
}

// Models Page Component
export function ModelsPage() {
  const handleBuildYourOwn = (modelName: string) => {
    console.log(`Build your own ${modelName} clicked`);
    // Add navigation or modal logic here
  };

  const handleFindOutMore = (modelName: string) => {
    console.log(`Find out more about ${modelName} clicked`);
    // Add navigation logic here
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-background">
      <div className="container mx-auto">
        <h1 className="text-5xl font-bold text-center mb-12">Our Models</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">
          {MODELS_DATA.map((model, index) => (
            <ModelCard
              key={index}
              modelName={model.modelName}
              year={model.year}
              price={model.price}
              imageDefault={model.imageDefault}
              imageHover={model.imageHover}
              onBuildYourOwn={() => handleBuildYourOwn(model.modelName)}
              onFindOutMore={() => handleFindOutMore(model.modelName)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}