"use client";

interface ConfirmSettingsChangeModalProps {
  open: boolean;
  isSaving?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmSettingsChangeModal = ({
  open,
  isSaving = false,
  onConfirm,
  onCancel,
}: ConfirmSettingsChangeModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onCancel}
        disabled={isSaving}
        className="absolute inset-0 bg-black/65 backdrop-blur-[2px] animate-[fadeIn_200ms_ease-out]"
      />

      <div className="relative w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-5 shadow-xl animate-[fadeIn_220ms_ease-out]">
        <h2 className="text-lg font-semibold text-white">Change strict ruling?</h2>
        <p className="mt-2 text-sm text-gray-300">
          Are you sure you want to change the strict ruling? This could change how current inputted times are interpreted.
        </p>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSaving}
            className="rounded-md bg-green-600/90 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500/90 disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Yes, change"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSettingsChangeModal;