import { Trash2 } from 'lucide-react';

export default function ConfirmButton({ onConfirm, label = 'Delete', message = 'Delete this item?' }) {
  return (
    <button
      className="danger-button"
      onClick={() => {
        if (window.confirm(message)) onConfirm();
      }}
      type="button"
    >
      <Trash2 className="h-4 w-4" />
      {label}
    </button>
  );
}
