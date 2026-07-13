import { Bell, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const reminders = [
  {
    title: 'Meeting with Arc Company',
    time: '02:00 pm - 04:00 pm',
    icon: CalendarDays,
  },
  {
    title: 'Review team sprint goals',
    time: '05:30 pm - 06:00 pm',
    icon: Bell,
  },
];

export function DashboardRemindersCard() {
  return (
    <Card className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <CardHeader className="items-start gap-3 p-0">
        <div>
          <CardTitle className="text-xl text-slate-950">Reminders</CardTitle>
          <CardDescription>
            Keep focus on meetings, deadlines, and planned actions.
          </CardDescription>
        </div>
        <Badge variant="secondary">Today</Badge>
      </CardHeader>

      <CardContent className="mt-6 p-0">
        <div className="space-y-4">
          {reminders.map((reminder) => {
            const Icon = reminder.icon;

            return (
              <div
                key={reminder.title}
                className="rounded-[1.75rem] border border-border bg-muted p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <div className="grid h-12 w-12 place-items-center rounded-3xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{reminder.title}</p>
                      <p className="text-sm text-slate-500">{reminder.time}</p>
                    </div>
                  </div>
                  <Badge variant="outline">Upcoming</Badge>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-[1.75rem] bg-muted p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Daily focus</p>
              <p className="font-semibold text-slate-950">
                Start meeting with product team
              </p>
            </div>
            <Button variant="default" size="sm">
              Start Meeting
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
