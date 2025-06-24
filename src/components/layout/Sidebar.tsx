import { ExternalLink } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import type { NavigationItem } from '../../types/navigation';
import type { FC } from 'react';
import logo from '../../assets/images/logo.webp';

interface SidebarProps {
  navigationItems: NavigationItem[];
}

const Sidebar: FC<SidebarProps> = ({
  navigationItems,
}) => {
  const location = useLocation();

  return (
    <aside className="w-[260px] flex-none bg-card border-r border-border h-full flex flex-col">
      <header className="h-16 flex items-center justify-center border-b border-border">
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-auto invert"
          />
        </Link>
      </header>

      <nav className="flex-1 p-4" aria-label="Primary navigation">
        <ul className="space-y-2" role="list">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <li key={item.id}>
                <Link to={item.path || '/'}>
                  <Button
                    variant={isActive ? 'primary' : 'ghost'}
                    className="w-full justify-start cursor-pointer"
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <footer className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start mb-2">
          <ExternalLink className="mr-3 h-4 w-4" aria-hidden="true" />
          Open in Music
        </Button>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground">
          Try Beta
        </Button>
      </footer>
    </aside>
  );
};

export default Sidebar;