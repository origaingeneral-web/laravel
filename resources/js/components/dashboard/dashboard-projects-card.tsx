import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const projects = [
  {
    title: 'Develop API Endpoints',
    status: 'In Progress',
    due: 'Due today',
  },
  {
    title: 'Onboarding Flow',
    status: 'Review',
    due: 'Due tomorrow',
  },
  {
    title: 'Build Dashboard UI',
    status: 'Planning',
    due: 'Due in 2 days',
  },
];

function statusVariant(status: string) {
  if (status === 'In Progress') {
    return 'default';
  }

  if (status === 'Review') {
    return 'secondary';
  }

  return 'outline';
}

export function DashboardProjectsCard() {
  return (
    <Card className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <CardHeader className="items-start gap-3 p-0">
        <div>
          <CardTitle className="text-xl text-slate-950">Project</CardTitle>
          <CardDescription>
            Tasks and milestones that need your attention.
          </CardDescription>
        </div>
        <Badge variant="secondary">3 items</Badge>
      </CardHeader>

      <CardContent className="mt-6 p-0">
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.title}
              className="grid gap-4 rounded-[1.75rem] border border-border bg-muted p-4 sm:grid-cols-[1fr_auto]"
            >
              <div>
                <p className="font-semibold text-slate-950">{project.title}</p>
                <p className="mt-1 text-sm text-slate-500">{project.due}</p>
              </div>
              <Badge variant={statusVariant(project.status)}>
                {project.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
