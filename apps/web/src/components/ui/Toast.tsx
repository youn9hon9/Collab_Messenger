'use client';

export function Toast({ message, onClose }: { message: string | null; onClose?: () => void }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-gray-900 text-white text-sm px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in">
      <span>{message}</span>
      {onClose && (
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-white shrink-0">
          ✕
        </button>
      )}
    </div>
  );
}
