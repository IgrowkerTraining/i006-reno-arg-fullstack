interface FooterActionsProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  disableNext?: boolean;
  isLoading?: boolean;
}

const FooterActions = ({
  onBack,
  onNext,
  nextLabel = "Siguiente",
  backLabel = "Atrás",
  disableNext = false,
  isLoading = false,
}: FooterActionsProps) => {
  return (
    <div className="flex justify-between mt-6">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
        >
          {backLabel}
        </button>
      ) : (
        <div />
      )}

      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={disableNext || isLoading}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-blue-700 transition-colors"
        >
          {isLoading ? "Procesando..." : nextLabel}
        </button>
      )}
    </div>
  );
};

export default FooterActions;