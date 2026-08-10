import { ReactNode } from 'react';
import { CreditCard, ArrowUpRight, CheckCircle2, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface PlanUsage {
  plan: string;
  assign: number;
  used: number;
  left: number;
}

export function SubscriptionSheet({ trigger }: { trigger: ReactNode }) {
  const usageData: PlanUsage[] = [
    { plan: 'Flash Force', assign: 1000, used: 189, left: 811 },
    { plan: 'Mega Force', assign: 1000, used: 181, left: 819 },
    { plan: 'Force Ignitor', assign: 1000, used: 65, left: 935 },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="p-0 gap-0 sm:w-[500px] sm:max-w-none inset-5 start-auto h-auto rounded-lg overflow-hidden [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="p-4 border-b border-border bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-row items-center gap-3 space-y-0 shadow-xs shrink-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-xs">
            <CreditCard className="size-5" />
          </div>
          <div>
            <SheetTitle className="text-base font-bold text-white leading-tight">Plan & Billing</SheetTitle>
            <p className="text-[11px] text-blue-100/90 leading-normal">
              Monitor your active limits, billing cycles, and payments.
            </p>
          </div>
        </SheetHeader>

        <SheetBody className="grow p-5 space-y-6 overflow-y-auto">
          {/* Active Plan Card */}
          <div className="rounded-xl border border-border/80 bg-card p-4 relative overflow-hidden shadow-xs">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 size-24 rounded-full bg-blue-500/10 blur-xl"></div>
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Sparkles className="size-3" />
                  Active Plan
                </span>
                <h3 className="text-lg font-bold text-foreground mt-2">Enterprise Force</h3>
                <p className="text-xs text-muted-foreground mt-1">Next renewal: <span className="font-semibold text-foreground">Sep 26, 2026</span></p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-foreground">$149.00</p>
                <p className="text-xs text-muted-foreground">per month</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between gap-4">
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-1 text-xs rounded-lg h-8 shadow-xs">
                Upgrade Plan
                <ArrowUpRight className="size-3.5" />
              </Button>
              <Button size="sm" variant="outline" className="w-full text-xs rounded-lg h-8 border-border/80 hover:bg-muted/10">
                Cancel Auto-Renew
              </Button>
            </div>
          </div>

          {/* Usage Table from Image */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Limit Allocations</h4>
            <div className="rounded-xl border border-border/60 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 text-muted-foreground border-b border-border/60 font-semibold">
                  <tr>
                    <th className="p-3">Plan</th>
                    <th className="p-3 text-center">Assign</th>
                    <th className="p-3 text-center">Used</th>
                    <th className="p-3 text-center">Left</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {usageData.map((row, idx) => {
                    const usagePercent = Math.min(100, (row.used / row.assign) * 100);
                    return (
                      <tr key={idx} className="hover:bg-muted/10 transition-colors">
                        <td className="p-3 font-semibold text-foreground">{row.plan}</td>
                        <td className="p-3 text-center font-medium text-muted-foreground">{row.assign}</td>
                        <td className="p-3 text-center font-semibold text-foreground">
                          <div className="flex flex-col items-center gap-1.5">
                            <span>{row.used}</span>
                            <div className="w-16 h-1 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${usagePercent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">{row.left}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Payments list */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent Payments</h4>
            <div className="space-y-2.5">
              {[
                { date: 'Aug 10, 2026', amt: '$149.00', status: 'Paid' },
                { date: 'Jul 10, 2026', amt: '$149.00', status: 'Paid' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:bg-muted/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{item.date}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Mastercard ending in 4242</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-foreground">{item.amt}</span>
                    <Button size="sm" variant="ghost" mode="icon" className="size-7 text-muted-foreground hover:text-foreground">
                      <FileText className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
