/** `datetime-local` input value (YYYY-MM-DDTHH:mm) */
export function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocalValue(value: string): Date {
  return new Date(value);
}

export function defaultScheduleDatetimeLocal(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);
  return toDatetimeLocalValue(d);
}

export function parseSchedulePreset(label: string, now = new Date()): Date {
  const d = new Date(now);
  if (label.includes('내일')) {
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    return d;
  }
  if (label.includes('월요일')) {
    const day = d.getDay();
    const add = day === 1 ? 7 : (8 - day) % 7;
    d.setDate(d.getDate() + add);
    d.setHours(9, 0, 0, 0);
    return d;
  }
  d.setMinutes(d.getMinutes() + 30);
  return d;
}

export function formatScheduledAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
