import { useState } from "react";
import { Check, Copy } from "lucide-react";
import styles from "./CodeBlock.module.css";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showCopy?: boolean;
}

export default function CodeBlock({
  code,
  language = "tsx",
  filename,
  showCopy = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.wrapper}>
      {(filename || showCopy) && (
        <div className={styles.bar}>
          <span className={styles.filename}>{filename || language}</span>
          {showCopy && (
            <button
              className={styles.copyBtn}
              onClick={handleCopy}
              aria-label="Copy code"
            >
              {copied ? (
                <><Check size={13} /><span>Copied</span></>
              ) : (
                <><Copy size={13} /><span>Copy</span></>
              )}
            </button>
          )}
        </div>
      )}
      <pre className={styles.pre}>
        <code className={styles.code}>{code.trim()}</code>
      </pre>
    </div>
  );
}
