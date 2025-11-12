import { HTMLAttributes } from 'react';

interface FormattedContentProps extends HTMLAttributes<HTMLDivElement> {
  content: string;
  className?: string;
}

export function FormattedContent({ content, className, ...props }: FormattedContentProps) {
  // Jika konten kosong, tidak tampilkan apapun
  if (!content || content.trim() === '<p></p>' || content.trim() === '') {
    return null;
  }

  return (
    <div
      className={`prose prose-emerald max-w-none ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: content }}
      {...props}
    />
  );
}