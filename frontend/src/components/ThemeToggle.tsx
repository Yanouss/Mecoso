import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-10 w-10 rounded-full border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-300 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:scale-110"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 text-amber-500 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 text-blue-400 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};