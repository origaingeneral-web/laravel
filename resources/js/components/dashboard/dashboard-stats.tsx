import { Activity, CheckCircle2, Clock3, Folder } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type StatItem = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  badge: string;
};

const stats: StatItem[] = [
  {
    title: 'Total Projects',
    value: '24',
    description: 'In progress and complete this month.',
    icon: Folder,
    badge: 'Updated',
  },
  {
    title: 'Ended Projects',
    value: '10',
    description: 'Closed successfully this quarter.',
    icon: CheckCircle2,
    badge: 'Stable',
  },
  {
    title: 'Running Projects',
    value: '12',
    description: 'Active projects currently open.',
    icon: Activity,
    badge: 'Live',
  },
  {
    title: 'Pending Projects',
    value: '2',
    description: 'Waiting for final approval.',
    icon: Clock3,
    badge: 'Pending',
  },
];

function DashboardStatCard({ item }: { item: StatItem }) {
  const Icon = item.icon;

  return (
    <Card className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <CardHeader className="items-start justify-between gap-3 p-0">
        <div>
          <CardTitle className="text-base text-slate-900">{item.title}</CardTitle>
          <CardDescription className="mt-2 text-sm text-slate-500">
            {item.description}
          </CardDescription>
        </div>
        <Badge variant="outline">{item.badge}</Badge>
      </CardHeader>
      <CardContent className="mt-6 p-0">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-4xl font-semibold text-slate-950">{item.value}</p>
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-3xl bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <DashboardStatCard key={item.title} item={item} />
      ))}
    </div>
  );
}
