"use client";
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

function isStatus(s?: string | null): s is 'todo' | 'in_progress' | 'done' {
  return s === 'todo' || s === 'in_progress' || s === 'done';
}

export default function FilterTabs() {
  const pathname = usePathname();
  const sp = useSearchParams();
  const status = sp.get('status');
  const active = isStatus(status) ? status : undefined;

  const makeHref = (s?: 'todo' | 'in_progress' | 'done') => {
    const params = new URLSearchParams(sp.toString());
    if (s) params.set('status', s);
    else params.delete('status');
    params.delete('error');
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const baseBtn =
    'px-3 py-1.5 rounded-full border text-sm transition-colors border-white/20 bg-white/10 hover:bg-white/15 backdrop-blur';
  const activeBtn = 'bg-white/20 border-white/30';

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-300">Filter:</span>
      <Link className={`${baseBtn} ${!active ? activeBtn : ''}`} href={makeHref(undefined)}>All</Link>
      <Link className={`${baseBtn} ${active === 'todo' ? activeBtn : ''}`} href={makeHref('todo')}>To do</Link>
      <Link className={`${baseBtn} ${active === 'in_progress' ? activeBtn : ''}`} href={makeHref('in_progress')}>In progress</Link>
      <Link className={`${baseBtn} ${active === 'done' ? activeBtn : ''}`} href={makeHref('done')}>Done</Link>
    </div>
  );
}
