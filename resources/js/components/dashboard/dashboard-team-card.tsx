import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const team = [
  {
    name: 'Alexandra Deff',
    role: 'Working on Github Project Repository',
    status: 'Completed',
  },
  {
    name: 'Edwin Adenike',
    role: 'Integrate user authentication system',
    status: 'In Progress',
  },
];

export function DashboardTeamCard() {
  return (
    <Card className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <CardHeader className="items-start gap-3 p-0">
        <div>
          <CardTitle className="text-xl text-slate-950">Team Collaboration</CardTitle>
          <CardDescription>
            See what your team is working on and who needs support.
          </CardDescription>
        </div>
        <button className="rounded-3xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90">
          + Add Member
        </button>
      </CardHeader>

      <CardContent className="mt-6 p-0">
        <div className="space-y-4">
          {team.map((member) => (
            <div
              key={member.name}
              className="flex items-center justify-between gap-4 rounded-[1.75rem] border border-border bg-muted p-4"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    {member.name
                      .split(' ')
                      .map((word) => word.at(0))
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-slate-950">{member.name}</p>
                  <p className="text-sm text-slate-500">{member.role}</p>
                </div>
              </div>
              <Badge
                variant={member.status === 'Completed' ? 'default' : 'secondary'}
              >
                {member.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
