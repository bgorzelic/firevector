import { Flame, FileEdit, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardsProps {
  total: number;
  drafts: number;
  completed: number;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  iconClassName?: string;
}

function StatCard({ label, value, icon: Icon, iconClassName }: StatCardProps) {
  return (
    <Card className="transition-shadow hover:glow-amber">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
          <span className="flex size-8 items-center justify-center rounded-md bg-amber-500/10">
            <Icon className={iconClassName ?? 'size-4 text-amber-500 dark:text-amber-400'} />
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-mono-numbers text-3xl font-bold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}

export function StatsCards({ total, drafts, completed }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        label="Total Observations"
        value={total}
        icon={Flame}
        iconClassName="size-4 text-amber-500 dark:text-amber-400"
      />
      <StatCard
        label="Active Drafts"
        value={drafts}
        icon={FileEdit}
        iconClassName="size-4 text-amber-500 dark:text-amber-400"
      />
      <StatCard
        label="Completed"
        value={completed}
        icon={CheckCircle}
        iconClassName="size-4 text-amber-500 dark:text-amber-400"
      />
    </div>
  );
}
