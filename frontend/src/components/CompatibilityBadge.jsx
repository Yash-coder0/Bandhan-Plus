// Shows compatibility percentage with color coding
const CompatibilityBadge = ({ score }) => {
  // Color based on score
  const color = score >= 80 ? 'text-green-600 bg-green-50 border-green-200'
    : score >= 60 ? 'text-amber-600 bg-amber-50 border-amber-200'
    : 'text-red-600 bg-red-50 border-red-200';

  return (
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-semibold mb-2 ${color}`}>
      🎯 {score}% Compatible
    </div>
  );
};

export default CompatibilityBadge;