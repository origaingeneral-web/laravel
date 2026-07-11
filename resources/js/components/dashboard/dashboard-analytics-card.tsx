import { BarChart3, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const analyticsLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const analyticsValues = [28, 42, 60, 78, 64, 92, 54];

export function DashboardAnalyticsCard() {
  return (
    <Card className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <CardHeader className="items-start gap-4 p-0">
        <div>
          <CardTitle className="text-xl text-slate-950">Project Analytics</CardTitle>
          <CardDescription>
            Weekly performance across active projects.
          </CardDescription>
        </div>
        <Badge variant="secondary">Weekly</Badge>
      </CardHeader>

      <CardContent className="mt-6 p-0">
        <div className="space-y-6">
          <div className="grid gap-4 rounded-[1.5rem] bg-muted p-5 text-sm text-slate-600 sm:grid-cols-[minmax(0,1fr)_130px]">
            <div>
              <p className="uppercase tracking-[0.24em] text-xs text-slate-500">
                Project analytics
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-950">
                745
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Completed research, delivery and review metrics this week.
              </p>
            </div>
            <div className="space-y-3 rounded-[1.5rem] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
                <span>Growth</span>
                <span>+12%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-border">
                <div className="h-full w-3/5 rounded-full bg-primary" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] bg-muted p-4">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span>Actions completed</span>
              </div>
              <p className="mt-4 text-3xl font-semibold text-slate-950">84%</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-border">
                <div className="h-full w-[84%] rounded-full bg-primary" />
              </div>
            </div>
            <div className="rounded-[1.5rem] bg-muted p-4">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Sparkles className="h-4 w-4 text-secondary-foreground" />
                <span>Team engagement</span>
              </div>
              <p className="mt-4 text-3xl font-semibold text-slate-950">72%</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-border">
                <div className="h-full w-[72%] rounded-full bg-secondary" />
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-7">
            {analyticsValues.map((value, index) => (
              <div key={index} className="flex flex-col items-center gap-3 text-center text-xs">
                <div className="flex h-44 w-full items-end rounded-[1.5rem] bg-slate-100 p-2">
                  <div
                    className="w-full rounded-t-[1.5rem] bg-primary"
                    style={{ height: `${value}%` }}
                  />
                </div>
                <span>{analyticsLabels[index]}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
