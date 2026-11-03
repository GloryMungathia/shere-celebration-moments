import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  hint?: string;
  htmlFor?: string;
  error?: string;
}

export default function FormField({ label, children, hint, htmlFor, error }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      {htmlFor ? (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-stone-700">
          {label}
        </label>
      ) : (
        <p className="block text-sm font-medium text-stone-700">{label}</p>
      )}
      {children}
      {hint && !error && <p className="text-xs text-stone-400">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function Input({ invalid, className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-xl border px-4 py-2.5 text-stone-800 placeholder:text-stone-400 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400/40 ${
        invalid ? 'border-red-300 bg-red-50' : 'border-stone-200 bg-white'
      } ${className}`}
      {...props}
    />
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export function TextArea({ invalid, className = '', ...props }: TextAreaProps) {
  return (
    <textarea
      className={`w-full rounded-xl border px-4 py-2.5 text-stone-800 placeholder:text-stone-400 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400/40 resize-none ${
        invalid ? 'border-red-300 bg-red-50' : 'border-stone-200 bg-white'
      } ${className}`}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export function Select({ invalid, className = '', children, ...props }: SelectProps) {
  return (
    <select
      className={`w-full rounded-xl border px-4 py-2.5 text-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400/40 ${
        invalid ? 'border-red-300 bg-red-50' : 'border-stone-200 bg-white'
      } ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
