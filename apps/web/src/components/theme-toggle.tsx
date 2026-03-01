'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safety: must detect client mount via state
    setMounted(true);
  }, []);

  const currentLabel =
    theme === 'light'
      ? 'Switch theme (currently Light)'
      : theme === 'dark'
        ? 'Switch theme (currently Dark)'
        : 'Switch theme (currently System)';

  const currentIcon = !mounted ? (
    <Moon className="size-4" aria-hidden="true" />
  ) : theme === 'light' ? (
    <Sun className="size-4" aria-hidden="true" />
  ) : theme === 'dark' ? (
    <Moon className="size-4" aria-hidden="true" />
  ) : (
    <Monitor className="size-4" aria-hidden="true" />
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9"
          aria-label={mounted ? currentLabel : 'Switch theme'}
          aria-haspopup="menu"
        >
          {currentIcon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="size-4" aria-hidden="true" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="size-4" aria-hidden="true" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="size-4" aria-hidden="true" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
