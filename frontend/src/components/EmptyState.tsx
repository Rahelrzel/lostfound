interface EmptyStateProps {
  title?: string;
  message?: string;
}

export default function EmptyState({
  title = 'No reports found',
  message = 'Try adjusting your filters or search terms.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-gray-300 rounded-lg">
      <span className="text-3xl mb-2">🔍</span>
      <p className="text-gray-900 font-medium">{title}</p>
      <p className="text-gray-500 text-sm mt-1">{message}</p>
    </div>
  );
}