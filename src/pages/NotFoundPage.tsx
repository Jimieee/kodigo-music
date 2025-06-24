import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Music, Play } from 'lucide-react';
import { Button } from '../components/ui/Button';
import type { FC } from 'react';

const NotFoundPage: FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative mb-8 sm:mb-12">
          <div className="absolute inset-0 bg-primary opacity-20 blur-3xl rounded-full scale-150"></div>
          <div className="relative bg-card border border-border rounded-full w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mx-auto flex items-center justify-center mb-6 sm:mb-8">
            <Music className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-primary" />
          </div>
        </div>

        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <span className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold text-primary">4</span>
            <div className="relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-primary rounded-full flex items-center justify-center">
                <Play className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-primary-foreground ml-1" />
              </div>
            </div>
            <span className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold text-primary">4</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            Page Not Found
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-4">
            The page you're looking for seems to have been removed from your library or moved to a different playlist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md mx-auto">
          <Button
            onClick={handleGoHome}
            variant="primary"
            size="lg"
            className="w-full cursor-pointer sm:w-auto gap-2 sm:gap-3 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
          >
            <Home className="w-5 h-5" />
            <span>Go to Library</span>
          </Button>

          <Button
            onClick={handleGoBack}
            variant="default"
            size="lg"
            className="w-full cursor-pointer sm:w-auto gap-2 sm:gap-3 hover:scale-105 border border-border transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </Button>
        </div>

        <div className="fixed inset-0 pointer-events-none opacity-5">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-primary rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;