import React from 'react';
import { Link as InertiaLink, usePage, router } from '@inertiajs/react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

export const Link: React.FC<LinkProps> = ({ to, ...props }) => {
  return <InertiaLink href={to} {...props} />;
};

export const NavLink: React.FC<LinkProps & { className?: string | ((props: { isActive: boolean }) => string) }> = ({
  to,
  className,
  ...props
}) => {
  const { url } = usePage();
  const pathname = url.split('?')[0];
  const isActive = pathname === to || pathname.startsWith(to + '/');

  const resolvedClassName = typeof className === 'function' ? className({ isActive }) : className;

  return <InertiaLink href={to} className={resolvedClassName} {...props} />;
};

export const useLocation = () => {
  const { url } = usePage();
  const pathname = url.split('?')[0];
  return {
    pathname,
    search: url.includes('?') ? '?' + url.split('?')[1] : '',
    hash: '',
    state: null,
    key: 'default',
  };
};

export const useNavigate = () => {
  return (to: string | number, options?: any) => {
    if (typeof to === 'number') {
      window.history.go(to);
    } else {
      router.visit(to, options);
    }
  };
};

export const useParams = () => {
  const { props } = usePage();
  return (props.params as Record<string, string>) || {};
};

export const useSearchParams = () => {
  const { url } = usePage();
  const searchParams = new URLSearchParams(url.includes('?') ? url.split('?')[1] : '');
  const setSearchParams = (nextInit: any) => {
    const nextParams = typeof nextInit === 'function' ? nextInit(searchParams) : nextInit;
    router.visit(window.location.pathname + '?' + new URLSearchParams(nextParams).toString());
  };
  return [searchParams, setSearchParams] as const;
};

export const Outlet: React.FC = () => {
  return null;
};
