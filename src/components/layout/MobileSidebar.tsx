import type { FC } from "react";
import type { NavigationItem } from "../../types/navigation";
import { ExternalLink, X } from "lucide-react";
import { Button } from "../ui/Button";
import logo from '../../assets/images/logo.webp';
import Footer from "./Footer";
import { Link } from "react-router-dom";

interface SidebarProps {
  navigationItems: NavigationItem[];
  isMobile?: boolean;
  onItemClick?: () => void;
}

const MobileSidebar: FC<SidebarProps> = ({
  navigationItems,
  isMobile,
  onItemClick
}) => {
  if (!isMobile) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onItemClick}
      />

      {/* Sidebar */}
      <div className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <div className="flex items-center">
            <Link to="/">
              <img
                src={logo}
                alt="Logo"
                className="h-12 w-auto invert"
              />
            </Link>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onItemClick}
            className="w-10 h-10 p-0 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <Link to={item.path || '/'}>
                  <Button
                    variant={item.active ? 'primary' : 'ghost'}
                    className="w-full justify-start cursor-pointer"
                    onClick={onItemClick}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Button>
                </Link>

              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="px-4 pb-4 border-t border-border pt-4">
          <Button
            variant="ghost"
            className="w-full justify-start mb-2"
            onClick={onItemClick}
          >
            <ExternalLink className="mr-3 h-4 w-4" />
            Open in Music
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            onClick={onItemClick}
          >
            Try Beta
          </Button>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default MobileSidebar;