'use client';

import type { InferSelectModel } from 'drizzle-orm';
import type { observations } from '@/lib/db/schema';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

type Observation = InferSelectModel<typeof observations>;

interface ObservationsTableProps {
  observations: Observation[];
}

function formatDatetime(dt: Date | null | undefined): string {
  if (!dt) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(dt));
}

function formatNumber(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—';
  return n.toFixed(2);
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'complete') {
    return (
      <Badge className="bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20 hover:bg-green-500/20">
        Complete
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20">
      Draft
    </Badge>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-base font-medium text-foreground">No observations yet</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Create your first one to get started.
      </p>
    </div>
  );
}

function ObservationCard({ obs }: { obs: Observation }) {
  return (
    <Link href={`/observations/${obs.id}`} className="block">
      <Card className="mb-3 transition-colors hover:bg-accent/50">
        <CardContent className="pt-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium leading-tight">
                {obs.incidentName || <span className="text-muted-foreground italic">Unnamed</span>}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatDatetime(obs.observationDatetime)}
              </p>
            </div>
            <StatusBadge status={obs.status} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">EWS Ratio</p>
              <p className="font-mono-numbers font-medium">{formatNumber(obs.ewsRatio)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Projected ROS</p>
              <p className="font-mono-numbers font-medium">{formatNumber(obs.calculatedRos)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function ObservationsTable({ observations }: ObservationsTableProps) {
  const router = useRouter();

  if (observations.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Incident Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">EWS Ratio</TableHead>
              <TableHead className="text-right">Projected ROS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {observations.map((obs) => (
              <TableRow
                key={obs.id}
                className="cursor-pointer transition-colors hover:bg-accent/50"
                onClick={() => router.push(`/observations/${obs.id}`)}
              >
                <TableCell className="font-medium">
                  {obs.incidentName || (
                    <span className="italic text-muted-foreground">Unnamed</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDatetime(obs.observationDatetime)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={obs.status} />
                </TableCell>
                <TableCell className="text-right font-mono-numbers">
                  {formatNumber(obs.ewsRatio)}
                </TableCell>
                <TableCell className="text-right font-mono-numbers">
                  {formatNumber(obs.calculatedRos)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden">
        {observations.map((obs) => (
          <ObservationCard key={obs.id} obs={obs} />
        ))}
      </div>
    </>
  );
}
