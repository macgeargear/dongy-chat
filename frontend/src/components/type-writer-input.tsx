import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import type { InputHTMLAttributes } from "react";

interface TypewriterInputProps extends InputHTMLAttributes<HTMLInputElement> {
  texts: string[];
}

export function TypewriterInput({
  texts,
  className,
  ...props
}: TypewriterInputProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!texts || texts.length === 0) return;

    const current = texts[textIndex];
    const timeout = setTimeout(
      () => {
        if (isDeleting) {
          setDisplayText((prev) => prev.slice(0, -1));
        } else {
          setDisplayText((prev) => current.slice(0, prev.length + 1));
        }

        if (!isDeleting && displayText === current) {
          setTimeout(() => setIsDeleting(true), 1000);
        } else if (isDeleting && displayText === "") {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      },
      isDeleting ? 40 : 90,
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, texts]);

  return (
    <Input
      {...props}
      placeholder={`${displayText}|`}
      className={`font-mono ${className ?? ""}`}
    />
  );
}
