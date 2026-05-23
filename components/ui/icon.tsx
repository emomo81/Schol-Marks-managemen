type IconName =
  | "dash" | "students" | "entry" | "report" | "prom" | "subjects"
  | "chart" | "audit" | "settings" | "bell" | "search" | "plus"
  | "download" | "print" | "check" | "chevron" | "edit" | "lock"
  | "arrow" | "home" | "eye" | "shield";

const PATHS: Record<IconName, React.ReactNode> = {
  dash:     <><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></>,
  students: <><circle cx="9" cy="8" r="3.2"/><path d="M3 20c.5-3.5 3-5.5 6-5.5s5.5 2 6 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M15 20c.3-2.3 1.7-3.5 4-3.5 1.8 0 3 .8 3.5 2"/></>,
  entry:    <><rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 9h18M9 4v16M15 4v16"/></>,
  report:   <><path d="M6 3h10l4 4v14H6z"/><path d="M16 3v4h4"/><path d="M9 12h7M9 16h5M9 8h3"/></>,
  prom:     <><path d="M12 2l2.5 5 5.5.5-4 4 1 5.5L12 14l-5 3 1-5.5-4-4 5.5-.5z"/></>,
  subjects: <><path d="M4 5h16M4 12h16M4 19h10"/></>,
  chart:    <><path d="M4 20V8M10 20V4M16 20v-8M22 20H2"/></>,
  audit:    <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
  bell:     <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9zM10 21a2 2 0 0 0 4 0"/></>,
  search:   <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
  plus:     <><path d="M12 5v14M5 12h14"/></>,
  download: <><path d="M12 4v12M7 11l5 5 5-5M5 20h14"/></>,
  print:    <><rect x="6" y="3" width="12" height="6"/><rect x="6" y="15" width="12" height="6"/><path d="M6 9H4a2 2 0 0 0-2 2v5h4M18 9h2a2 2 0 0 1 2 2v5h-4"/></>,
  check:    <><path d="m4 12 5 5L20 6"/></>,
  chevron:  <><path d="m9 6 6 6-6 6"/></>,
  edit:     <><path d="M4 20h4l11-11-4-4L4 16zM14 5l4 4"/></>,
  lock:     <><rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>,
  arrow:    <><path d="M5 12h14M13 5l7 7-7 7"/></>,
  home:     <><path d="M4 11 12 4l8 7v9H4z"/></>,
  eye:      <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
  shield:   <><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z"/></>,
};

export function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round"
      className="inline-block shrink-0"
    >
      {PATHS[name] ?? <circle cx="12" cy="12" r="6" />}
    </svg>
  );
}
