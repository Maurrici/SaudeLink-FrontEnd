import DOMPurify from "dompurify";

interface SafeHTMLProps {
  html: string;
  className?: string;
}

export function SafeHTML({ html, className }: SafeHTMLProps) {
  const sanitized = DOMPurify.sanitize(html);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}