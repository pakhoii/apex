import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import './DiscoverCard.css';

interface DiscoverCardProps {
  title: string;
  subtitle: string;
  buttonText?: string;
  backgroundImage: string;
  onButtonClick?: () => void;
}

export function DiscoverCard({
  title,
  subtitle,
  buttonText = "Find more",
  backgroundImage,
  onButtonClick,
}: DiscoverCardProps) {
  return (
    <div className="discover-card-container">
      <Card className="discover-card relative overflow-hidden border-0 shadow-lg">
        {/* Background Image */}
        <div
          className="discover-card-background"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        
        {/* Content Overlay */}
        <div className="discover-card-content flex flex-col items-center justify-center h-full p-8">
          <div className="text-center z-10 max-w-2xl">
            <h2 className="discover-card-title text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white">
              {title}
            </h2>
            <p className="discover-card-subtitle text-xl md:text-2xl font-light mb-8 text-white">
              {subtitle}
            </p>
            <Button
              onClick={onButtonClick}
              className="discover-card-button bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-base font-semibold cursor-pointer transition-all duration-300"
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}