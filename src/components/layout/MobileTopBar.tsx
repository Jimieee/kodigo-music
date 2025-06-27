import type { FC } from "react";
import { Button } from "../ui/Button";
import { Menu } from "lucide-react";
import logo from '../../assets/images/logo.webp';
import { Link } from "react-router-dom";
import UserProfile from "./UserProfile";

interface MobileTopBarProps {
  onMenuToggle: () => void;
}

const MobileTopBar: FC<MobileTopBarProps> = ({
  onMenuToggle,
}) => {

  return (
    <>
      <header className="flex items-center justify-between h-16 px-4 bg-card border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="w-10 h-10 p-0 cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center flex-1 justify-center">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="h-12 w-auto invert"
            />
          </Link>
        </div>

        <UserProfile
          variant="mobile"
          showDropdownIcon={false}
        />
      </header>
    </>
  );
};

export default MobileTopBar;