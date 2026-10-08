import type { ReactNode, SVGProps } from "react";

const Icon = ({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
);

export const BulletListIcon = () => (
  <Icon>
    <circle cx="3" cy="4" r=".6" fill="currentColor" />
    <circle cx="3" cy="8" r=".6" fill="currentColor" />
    <circle cx="3" cy="12" r=".6" fill="currentColor" />
    <path d="M6.5 4h7M6.5 8h7M6.5 12h7" />
  </Icon>
);

export const NumberedListIcon = () => (
  <Icon>
    <path d="M6.5 4h7M6.5 8h7M6.5 12h7M2.5 3l1-.5V5.5M2.2 9.5c0-.8 1.6-.8 1.6 0 0 .7-1.6 1.2-1.6 1.9h1.7" />
  </Icon>
);

export const CheckListIcon = () => (
  <Icon>
    <rect x="2" y="2.5" width="3.5" height="3.5" rx=".8" />
    <rect x="2" y="9.5" width="3.5" height="3.5" rx=".8" />
    <path d="M8 4.3h5.5M8 11.3h5.5" />
  </Icon>
);

export const ArrowListIcon = () => (
  <Icon>
    <path d="M2 4h4M2 8h4M2 12h4M8.5 4h5M8.5 8h5M8.5 12h5" />
    <path d="M4.5 2.5 6 4 4.5 5.5" />
  </Icon>
);

export const SmileIcon = () => (
  <Icon>
    <circle cx="8" cy="8" r="6" />
    <path d="M5.5 9.5c.6 1 1.4 1.5 2.5 1.5s1.9-.5 2.5-1.5" />
    <circle cx="6" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="10" cy="6.5" r=".5" fill="currentColor" />
  </Icon>
);

export const UndoIcon = () => (
  <Icon>
    <path d="M3.5 6.5h6a3 3 0 0 1 0 6H6M3.5 6.5l2.5-2.5M3.5 6.5 6 9" />
  </Icon>
);

export const RedoIcon = () => (
  <Icon>
    <path d="M12.5 6.5h-6a3 3 0 0 0 0 6H10M12.5 6.5 10 4M12.5 6.5 10 9" />
  </Icon>
);

export const ClearFormatIcon = () => (
  <Icon>
    <path d="M3 3.5h8M7 3.5l-2 9M10 13l3-3m0 3-3-3" />
  </Icon>
);

export const CopyIcon = () => (
  <Icon>
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
    <path d="M10.5 5.5v-2a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3.5V9A1.5 1.5 0 0 0 4 10.5h1.5" />
  </Icon>
);

export const CheckIcon = () => (
  <Icon>
    <path d="m3 8.5 3.2 3L13 4.5" />
  </Icon>
);

export const MobileIcon = () => (
  <Icon>
    <rect x="4.5" y="1.5" width="7" height="13" rx="1.5" />
    <path d="M7 12.5h2" />
  </Icon>
);

export const DesktopIcon = () => (
  <Icon>
    <rect x="1.5" y="2.5" width="13" height="9" rx="1.5" />
    <path d="M5.5 14h5M8 11.5V14" />
  </Icon>
);

export const WarningIcon = () => (
  <Icon>
    <path d="M8 2 14.5 13.5h-13L8 2ZM8 6.5v3M8 11.5v.01" />
  </Icon>
);

export const SunIcon = () => (
  <Icon>
    <circle cx="8" cy="8" r="2.8" />
    <path d="M8 1.5v1.4M8 13.1v1.4M1.5 8h1.4M13.1 8h1.4M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
  </Icon>
);

export const MoonIcon = () => (
  <Icon>
    <path d="M13.5 9.6A5.6 5.6 0 0 1 6.4 2.5a5.6 5.6 0 1 0 7.1 7.1Z" />
  </Icon>
);
