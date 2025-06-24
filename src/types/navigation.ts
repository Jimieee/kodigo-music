export interface NavigationItem {
  id: string;
  path?: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}
