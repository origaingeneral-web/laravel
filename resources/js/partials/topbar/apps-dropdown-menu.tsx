import { ReactNode, useState, useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UserCheck, UserX, Clock, Search } from 'lucide-react';

export interface StaffDetail {
  id: string | number;
  name: string;
  time: string;
  department?: string;
  avatar?: string;
}

interface AppsDropdownMenuProps {
  trigger: ReactNode;
  loggedInStaff?: StaffDetail[];
  loggedOutStaff?: StaffDetail[];
}

const defaultLoggedInStaff: StaffDetail[] = [
  { id: 1, name: 'Abhishek Mishra', time: '10:15:48', department: 'Development' },
  { id: 2, name: 'Amit Mishra', time: '12:05:39', department: 'Management' },
  { id: 3, name: 'Arun Kumar Dhire', time: '12:05:19', department: 'Operations' },
  { id: 4, name: 'Ashish kadam', time: '14:16:23', department: 'Design' },
  { id: 5, name: 'Deepak Sharma', time: '09:30:15', department: 'Development' },
  { id: 6, name: 'Manish Verma', time: '09:45:00', department: 'QA' },
  { id: 7, name: 'Neha Gupta', time: '10:05:12', department: 'HR' },
  { id: 8, name: 'Pooja Singh', time: '10:30:45', department: 'Marketing' },
  { id: 9, name: 'Rahul Joshi', time: '11:15:20', department: 'Development' },
  { id: 10, name: 'Rohan Mehta', time: '11:40:55', department: 'Support' },
  { id: 11, name: 'Sanjay Kumar', time: '12:10:04', department: 'Finance' },
  { id: 12, name: 'Vikas Patel', time: '13:00:18', department: 'Sales' },
];

const defaultLoggedOutStaff: StaffDetail[] = [
  { id: 101, name: 'Kiran Patel', time: '18:30:15', department: 'Operations' },
  { id: 102, name: 'Nikhil Roy', time: '18:15:40', department: 'Development' },
  { id: 103, name: 'Priya Sharma', time: '17:45:00', department: 'HR' },
  { id: 104, name: 'Rajesh Kumar', time: '17:30:22', department: 'Finance' },
  { id: 105, name: 'Suresh Raina', time: '17:10:05', department: 'Sales' },
  { id: 106, name: 'Swati Deshmukh', time: '16:50:33', department: 'Design' },
];

export function AppsDropdownMenu({
  trigger,
  loggedInStaff = defaultLoggedInStaff,
  loggedOutStaff = defaultLoggedOutStaff,
}: AppsDropdownMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'login' | 'logout'>('login');

  const filteredLoggedIn = useMemo(() => {
    if (!searchQuery.trim()) return loggedInStaff;
    const q = searchQuery.toLowerCase();
    return loggedInStaff.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.department && s.department.toLowerCase().includes(q))
    );
  }, [loggedInStaff, searchQuery]);

  const filteredLoggedOut = useMemo(() => {
    if (!searchQuery.trim()) return loggedOutStaff;
    const q = searchQuery.toLowerCase();
    return loggedOutStaff.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.department && s.department.toLowerCase().includes(q))
    );
  }, [loggedOutStaff, searchQuery]);

  // Use 65 or total items for logged in count display matching exact prompt screenshot
  const loggedInTotalCount = 65;
  const loggedOutTotalCount = 18;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-[360px] p-0 shadow-xl border-border" side="bottom" align="end">
        <Tabs defaultValue="login" value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'logout')} className="w-full">
          {/* Header Tabs */}
          <div className="border-b border-border bg-muted/30 px-3 pt-3">
            <TabsList variant="line" className="w-full justify-start gap-4">
              <TabsTrigger value="login" className="flex items-center gap-2 pb-2.5 font-semibold text-xs cursor-pointer">
                <UserCheck className="size-4 text-emerald-600" />
                <span>Staff Login</span>
                <Badge variant="success" appearance="light" size="sm" shape="circle" className="ml-1 px-1.5 py-0.5 text-[10px]">
                  {loggedInTotalCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="logout" className="flex items-center gap-2 pb-2.5 font-semibold text-xs cursor-pointer">
                <UserX className="size-4 text-rose-500" />
                <span>Staff Logout</span>
                <Badge variant="outline" size="sm" shape="circle" className="ml-1 px-1.5 py-0.5 text-[10px]">
                  {loggedOutTotalCount}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Search Filter */}
          <div className="px-4 pt-3 pb-2 border-b border-border/50 bg-background">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search staff by name or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-muted/40 border-border/70 focus-visible:ring-1"
              />
            </div>
          </div>

          {/* Staff Login Content */}
          <TabsContent value="login" className="m-0 focus-visible:outline-none">
            <div className="px-4 py-2.5 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Staffs are Logged In {loggedInTotalCount}
              </h4>
              <span className="text-[11px] text-emerald-600/80 font-medium">
                {filteredLoggedIn.length} displayed
              </span>
            </div>

            <div className="flex flex-col max-h-[340px] overflow-y-auto divide-y divide-border/40">
              {filteredLoggedIn.length > 0 ? (
                filteredLoggedIn.map((staff) => (
                  <div
                    key={staff.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-accent/40 transition-colors"
                  >
                    <div className="flex items-center justify-center shrink-0 size-8 rounded-full bg-emerald-500/15 text-emerald-600">
                      <UserCheck className="size-4" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-semibold text-foreground truncate">
                        {staff.name}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                        <Clock className="size-3.5" />
                        <span>{staff.time}</span>
                        {staff.department && (
                          <span className="text-[11px] text-muted-foreground font-normal ml-auto">
                            {staff.department}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No logged-in staff found matching "{searchQuery}"
                </div>
              )}
            </div>
          </TabsContent>

          {/* Staff Logout Content */}
          <TabsContent value="logout" className="m-0 focus-visible:outline-none">
            <div className="px-4 py-2.5 bg-rose-500/10 border-b border-rose-500/20 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-rose-700 dark:text-rose-400">
                Staffs are Logged Out {loggedOutTotalCount}
              </h4>
              <span className="text-[11px] text-rose-600/80 font-medium">
                {filteredLoggedOut.length} displayed
              </span>
            </div>

            <div className="flex flex-col max-h-[340px] overflow-y-auto divide-y divide-border/40">
              {filteredLoggedOut.length > 0 ? (
                filteredLoggedOut.map((staff) => (
                  <div
                    key={staff.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-accent/40 transition-colors"
                  >
                    <div className="flex items-center justify-center shrink-0 size-8 rounded-full bg-rose-500/15 text-rose-500">
                      <UserX className="size-4" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-semibold text-foreground truncate">
                        {staff.name}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium mt-0.5">
                        <Clock className="size-3.5" />
                        <span>{staff.time}</span>
                        {staff.department && (
                          <span className="text-[11px] text-muted-foreground font-normal ml-auto">
                            {staff.department}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No logged-out staff found matching "{searchQuery}"
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

