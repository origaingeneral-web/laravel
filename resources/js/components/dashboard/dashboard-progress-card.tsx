import { CircleDollarSign, ClipboardList, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const progressItems = [
  {
    title: 'Completed',
    value: '41%',
    description: 'Project progress achieved so far.',
    icon: ShieldCheck,
    color: 'bg-primary/10 text-primary',
  },
  {
    title: 'Revenue',
    value: '$72.4k',
    description: 'Expected from active projects.',
    icon: CircleDollarSign,
    color: 'bg-secondary/10 text-secondary-foreground',
  },
  {
    title: 'Tasks',
    value: '28',
    description: 'Tasks completed this week.',
    icon: ClipboardList,
    color: 'bg-accent/10 text-accent-foreground',
  },
];

export function DashboardProgressCard() {
  return (
    <Card className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <CardHeader className="items-start gap-3 p-0">
        <div>
          <CardTitle className="text-xl text-slate-950">Project Progress</CardTitle>
          <CardDescription>
            Focus on the current phase and overall status.
          </CardDescription>
        </div>
        <Badge variant="secondary">41%</Badge>
      </CardHeader>

      <CardContent className="mt-6 p-0">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_170px]">
          <div className="rounded-[1.75rem] border border-border bg-muted p-6 text-center">
            <div className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-white shadow-sm">
              <div className="absolute inset-0 rounded-full bg-primary/10"></div>
              <div className="absolute inset-6 rounded-full border border-primary/20 bg-white"></div>
              <div className="relative flex h-full w-full items-center justify-center rounded-full">
                <div className="text-4xl font-semibold text-slate-950">41%</div>
              </div>
            </div>
            <p className="mt-5 text-sm text-slate-500">
              Current completion rate for all active projects.
            </p>
          </div>

          <div className="space-y-4">
            {progressItems.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="flex items-center gap-4 rounded-[1.75rem] border border-border bg-muted p-4">
                  <div className={`grid h-12 w-12 place-items-center rounded-3xl ${item.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.description}</p>
                  </div>
                  <div className="text-lg font-semibold text-slate-950">{item.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
