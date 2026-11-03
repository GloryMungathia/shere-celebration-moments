const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function formatEventDate(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatEventTime(value: string | null | undefined): string {
  if (!value) return '';
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return value;
  const hours = Number(match[1]);
  if (hours > 23) return value;
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const twelve = hours % 12 === 0 ? 12 : hours % 12;
  return `${twelve}:${match[2]} ${suffix}`;
}
