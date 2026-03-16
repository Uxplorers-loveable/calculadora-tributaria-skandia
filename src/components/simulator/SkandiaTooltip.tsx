import { Info } from 'lucide-react';

interface SkandiaTooltipProps {
  content: string;
  color?: 'blue' | 'amber' | 'green';
}

const SkandiaTooltip = ({ content, color = 'blue' }: SkandiaTooltipProps) => {
  const colorClass = color === 'blue'
    ? 'skandia-tooltip-blue'
    : color === 'amber'
    ? 'skandia-tooltip-amber'
    : 'skandia-tooltip-green';

  return (
    <div className={`mt-3 ${colorClass}`}>
      <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p>{content}</p>
    </div>
  );
};

export default SkandiaTooltip;
