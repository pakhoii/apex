import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import './ModelCard.css';

// ============================================
// ModelCard.tsx - Pure Component
// ============================================

interface ModelCardProps {
  modelName: string;
  year: string | number;
  price: number;
  imageDefault: string;
  imageHover: string;
  onBuildYourOwn?: () => void;
  onFindOutMore?: () => void;
}

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
          <div
            className="model-card-background"
            style={{ backgroundImage: `url(${imageDefault})` }}
          />
          <div className="model-card-content flex flex-col items-center justify-end h-full p-8 pb-16">
            <div className="text-center z-10">
              <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                {modelName}
              </h2>
              <p className="text-base text-gray-800 dark:text-gray-200 mb-1">
                {year}
              </p>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Start from ${price.toLocaleString('en-US')}
              </p>
            </div>
          </div>
        </div>

        {/* Hover View */}
        <div
          className={`model-card-hover absolute inset-0 transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="model-card-background"
            style={{ backgroundImage: `url(${imageHover})` }}
          />
          <div className="model-card-content flex flex-col h-full p-8">
            <div className="text-center mb-6 z-10 mt-8">
              <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                {modelName}
              </h2>
              <p className="text-base text-gray-800 dark:text-gray-200 mb-1">
                {year}
              </p>
              <p className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">
                Start from ${price.toLocaleString('en-US')}
              </p>
              <Button
                onClick={onBuildYourOwn}
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-base font-semibold cursor-pointer"
              >
                Build your own
              </Button>
            </div>
            <div className="flex-1"></div>
            <div className="text-center z-10 pb-4">
              <button
                onClick={onFindOutMore}
                className="text-gray-900 dark:text-white underline hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-base cursor-pointer"
              >
                Find out more
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}


// export const MODELS_DATA = [
//   {
//     modelName: "Range Rover Velar",
//     year: 2025,
//     price: 60000,
//     imageDefault: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
//     imageHover: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
//   },
//   {
//     modelName: "Range Rover Sport",
//     year: 2025,
//     price: 85000,
//     imageDefault: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
//     imageHover: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
//   },
//   {
//     modelName: "Range Rover Evoque",
//     year: 2025,
//     price: 48000,
//     imageDefault: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
//     imageHover: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
//   },
// ];