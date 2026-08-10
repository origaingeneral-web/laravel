import { ReactNode } from 'react';
import { Calendar, Settings, Settings2, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Item1 from './notifications/item-1';
import Item2 from './notifications/item-2';
import Item3 from './notifications/item-3';
import Item4 from './notifications/item-4';
import Item5 from './notifications/item-5';
import Item6 from './notifications/item-6';
import Item10 from './notifications/item-10';
import Item11 from './notifications/item-11';
import Item13 from './notifications/item-13';
import Item14 from './notifications/item-14';
import Item15 from './notifications/item-15';
import Item16 from './notifications/item-16';
import Item17 from './notifications/item-17';
import Item18 from './notifications/item-18';
import Item19 from './notifications/item-19';
import Item20 from './notifications/item-20';

export function NotificationsSheet({ trigger }: { trigger: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="p-0 gap-0 sm:w-[500px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 sm:max-w-none [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="mb-0">
          <SheetTitle className="p-3">
            Notifications
          </SheetTitle>
        </SheetHeader>
        <SheetBody className="grow p-0">
          <ScrollArea className="h-[calc(100vh-10.5rem)]">
            <Tabs defaultValue="all" className="w-full relative">
              <TabsList variant="line" className="w-full px-5 mb-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="request" className="gap-1.5 flex items-center">
                  Request
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold leading-none text-white bg-blue-600 rounded-full shrink-0">
                    6
                  </span>
                </TabsTrigger>
                <TabsTrigger value="report" className="gap-1.5 flex items-center">
                  Report
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold leading-none text-white bg-blue-600 rounded-full shrink-0">
                    5
                  </span>
                </TabsTrigger>
                <TabsTrigger value="logs" className="gap-1.5 flex items-center">
                  Logs
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold leading-none text-white bg-blue-600 rounded-full shrink-0">
                    6
                  </span>
                </TabsTrigger>
                <TabsTrigger value="info" className="gap-1.5 flex items-center">
                  Info
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold leading-none text-white bg-blue-600 rounded-full shrink-0">
                    2
                  </span>
                </TabsTrigger>
              </TabsList>

              {/* All Tab */}
              <TabsContent value="all" className="mt-0">
                <div className="flex flex-col gap-5 overflow-y-auto">
                  <Item1
                    userName="Joe Lincoln"
                    avatar="300-4.png"
                    description="mentioned you in"
                    link="Latest Trends"
                    label="topic"
                    time="18 mins ago"
                    specialist="Web Design 2024"
                    text="For an expert opinion, check out what Mike has to say on this topic!"
                  />
                  <div className="border-b border-b-border"></div>
                  <Item2 />
                  <div className="border-b border-b-border"></div>
                  <Item3
                    userName="Guy Hawkins"
                    avatar="300-27.png"
                    badgeColor="offline"
                    description="requested access to"
                    link="AirSpace"
                    day="project"
                    date="14 hours ago"
                    info="Dev Team"
                  />
                  <div className="border-b border-b-border"></div>
                  <Item4 />
                  <div className="border-b border-b-border"></div>
                  <Item5
                    userName="Raymond Pawell"
                    avatar="300-11.png"
                    badgeColor="online"
                    description="posted a new article"
                    link="2024 Roadmap"
                    day=""
                    date="1 hour ago"
                    info="Roadmap"
                  />
                  <div className="border-b border-b-border"></div>
                  <Item6 />
                </div>
              </TabsContent>

              {/* Request Tab */}
              <TabsContent value="request" className="mt-0">
                <div className="flex flex-col gap-5">
                  <Item13 />
                  <div className="border-b border-b-border"></div>
                  <Item14 />
                  <div className="border-b border-b-border"></div>
                  <Item15 />
                  <div className="border-b border-b-border"></div>
                  <Item16 />
                  <div className="border-b border-b-border"></div>
                  <Item3
                    userName="Benjamin Harris"
                    avatar="300-30.png"
                    badgeColor="offline"
                    description="requested to upgrade plan"
                    link=""
                    day=""
                    date="4 days ago"
                    info="Marketing"
                  />
                  <div className="border-b border-b-border"></div>
                  <Item5
                    userName="Isaac Morgan"
                    avatar="300-24.png"
                    badgeColor="online"
                    description="mentioned you in"
                    link="Data Transmission"
                    day="topic"
                    date="6 days ago"
                    info="Dev Team"
                  />
                </div>
              </TabsContent>

              {/* Report Tab */}
              <TabsContent value="report" className="mt-0">
                <div className="flex flex-col gap-5">
                  <Item10 />
                  <div className="border-b border-b-border"></div>
                  <Item5
                    userName="Adrian Vale"
                    avatar="300-6.png"
                    badgeColor="offline"
                    description="posted a new article"
                    link="Marketing"
                    day="to 13 May"
                    date="2 days ago"
                    info="Marketing"
                  />
                  <div className="border-b border-b-border"></div>
                  <Item11 />
                  <div className="border-b border-b-border"></div>
                  <Item1
                    userName="Selene Silverleaf"
                    avatar="300-21.png"
                    description="commented on"
                    link="SiteSculpt"
                    label=""
                    time="4 days ago"
                    specialist="Manager"
                    text="This design is simply stunning! From layout to color, it's a work of art!"
                  />
                  <div className="border-b border-b-border"></div>
                  <Item3
                    userName="Thalia Fox"
                    avatar="300-13.png"
                    badgeColor="online"
                    description="has invited you to join"
                    link="Design Research"
                    day=""
                    date="4 days ago"
                    info="Dev Team"
                  />
                </div>
              </TabsContent>

              {/* Logs Tab */}
              <TabsContent value="logs" className="mt-0">
                <div className="flex flex-col gap-5">
                  <Item18 />
                  <div className="border-b border-b-border"></div>
                  <Item17 />
                  <div className="border-b border-b-border"></div>
                  <Item19 />
                  <div className="border-b border-b-border"></div>
                  <Item5
                    userName="Chloe Morgan"
                    avatar="300-34.png"
                    badgeColor="online"
                    description="posted a new article"
                    link="User Experience"
                    day=""
                    date="1 day ago"
                    info="Nexus"
                  />
                  <div className="border-b border-b-border"></div>
                  <Item20 />
                  <div className="border-b border-b-border"></div>
                  <Item3
                    userName="Thalia Fox"
                    avatar="300-13.png"
                    badgeColor="offline"
                    description="has invited you to join"
                    link="Design Research"
                    day=""
                    date="4 days ago"
                    info="Dev Team"
                  />
                </div>
              </TabsContent>

              {/* Info Tab */}
              <TabsContent value="info" className="mt-0">
                <div className="flex flex-col gap-5">
                  <Item11 />
                  <div className="border-b border-b-border"></div>
                  <Item14 />
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </SheetBody>
        <SheetFooter className="border-t border-border p-5 grid grid-cols-2 gap-2.5">
          <Button variant="outline">Archive all</Button>
          <Button variant="outline">Mark all as read</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
