'use client';

import { useState, useCallback } from 'react';

interface EmailOutputProps {
  content: string;
  onRegenerate: (content:string) => Promise<string>;
}

export default function EmailOutput({ content, onRegenerate }: EmailOutputProps) {
  const [copied, setCopied] = useState(false);
  const [editable, setEditable] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [history, setHistory] = useState<string[]>([content]);
  const [loading, setLoading] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(editedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [editedContent]);

  const handleDownload = () => {
    const blob = new Blob([editedContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'generated-email.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const newContent = await onRegenerate(editedContent);
      setHistory((prev) => [editedContent, ...prev]); // Save old version
      setEditedContent(newContent);
    } catch (error) {
      console.error('Failed to regenerate:', error);
    } finally {
      setLoading(false);
    }
  };

  const wordCount = editedContent.trim().split(/\s+/).length;
  const charCount = editedContent.length;

  // Very basic keyword highlighting: email, date, name
  const highlightKeywords = (text: string) =>
    text.replace(/(\b(email|meeting|date|deadline|project|urgent|important)\b)/gi, '<mark class="bg-yellow-200 dark:bg-yellow-600">$1</mark>');

  return (
    <section
      aria-label="Generated email output"
      className="mt-6 rounded-md border bg-gray-50 p-4 dark:bg-neutral-900 dark:border-neutral-700"
    >
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Generated Email:</h2>
        <div className="flex gap-3 text-sm text-blue-600">
          <button onClick={() => setEditable(!editable)} className="hover:underline">
            {editable ? 'Lock' : 'Edit'}
          </button>
          <button onClick={handleCopy} className="hover:underline">
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button onClick={handleDownload} className="hover:underline">
            Download
          </button>
          <button onClick={handleRegenerate} className="hover:underline" disabled={loading}>
            {loading ? 'Regenerating...' : 'Regenerate'}
          </button>
        </div>
      </div>

      {editable ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          rows={10}
          className="w-full resize-none rounded border p-3 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800"
        />
      ) : (
        <pre
          className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-800 dark:text-gray-200"
          dangerouslySetInnerHTML={{ __html: highlightKeywords(editedContent) }}
        />
      )}

      <div className="mt-2 text-right text-xs text-gray-500 dark:text-gray-400">
        {wordCount} words • {charCount} characters
      </div>

      {history.length > 0 && (
        <div className="mt-4">
        <label className="block mb-1 text-sm font-semibold text-gray-600 dark:text-gray-300">
          Previous Versions:
        </label>
        <select
          className="w-[250px] p-2 rounded-md border bg-white dark:bg-neutral-800 dark:text-white"
          onChange={(e) => {
            const selectedIndex = parseInt(e.target.value);
            setEditedContent(history[selectedIndex]);
            setEditable(false);
          }}
          defaultValue=""
        >
          <option value="" disabled>Select a version</option>
          {history.map((ver, idx) => (
            <option key={idx} value={idx}>
              Version {history.length - idx}
            </option>
          ))}
        </select>
      </div>
      
      )}
    </section>
  );
}
