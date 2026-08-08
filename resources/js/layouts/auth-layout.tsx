import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent } from '@/components/ui/card';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <style>
                {`
                    .branded-bg {
                        background-image: url('${toAbsoluteUrl('/media/images/2600x1600/1.png')}');
                    }
                    .dark .branded-bg {
                        background-image: url('${toAbsoluteUrl('/media/images/2600x1600/1-dark.png')}');
                    }
                `}
            </style>
            <div className="grid min-h-screen grow bg-background lg:grid-cols-2">
                <div className="order-2 flex items-center justify-center p-8 lg:order-1 lg:p-10">
                    <Card className="w-full max-w-[400px]">
                        <CardContent className="p-6">{children}</CardContent>
                    </Card>
                </div>

                <div className="xxl:bg-center branded-bg order-1 min-h-[300px] bg-top bg-no-repeat lg:order-2 lg:m-5 lg:min-h-0 lg:rounded-xl lg:border lg:border-border xl:bg-cover">
                    <div className="flex flex-col gap-4 p-8 lg:p-16">
                        <Link to="/">
                            <img
                                src={toAbsoluteUrl('/media/app/mini-logo.svg')}
                                className="h-[28px] max-w-none"
                                alt=""
                            />
                        </Link>

                        <div className="flex flex-col gap-3">
                            <h3 className="text-2xl font-semibold text-mono">
                                Secure Dashboard Access
                            </h3>
                            <div className="text-base font-medium text-secondary-foreground">
                                A robust authentication gateway ensuring
                                <br /> secure&nbsp;
                                <span className="font-semibold text-mono">
                                    efficient user access
                                </span>
                                &nbsp;to the Metronic
                                <br /> Dashboard interface.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
