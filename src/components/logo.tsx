import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-7 w-7 text-primary', className)}
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M10.1 14.2c-.2.5-.3 1-.3 1.5c0 .4.1.8.2 1.2" />
      <path d="M14.9 14.2c.2.5.3 1 .3 1.5c0 .4-.1.8-.2 1.2" />
      <path d="M12.5 12.3c.4-.3.9-.5 1.4-.5c1.4 0 2.5 1.1 2.5 2.5c0 .4-.1.8-.2 1.2" />
      <path d="M9.4 11.2c.5.1 1 .2 1.5.2c.4 0 .9 0 1.3-.1" />
      <path d="M8.6 13.5c-.3.2-.5.5-.7.9" />
      <path d="M11.5 12.3c-.4-.3-.9-.5-1.4-.5c-1.4 0-2.5 1.1-2.5 2.5c0 .4.1.8.2 1.2" />
    </svg>
  );
}
