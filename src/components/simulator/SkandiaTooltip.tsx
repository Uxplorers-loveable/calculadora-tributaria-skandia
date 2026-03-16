import { Info, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface SkandiaTooltipProps {
  content: string;
  color?: 'blue' | 'amber' | 'green';
}

const SkandiaTooltip = ({ content, color = 'blue' }: SkandiaTooltipProps) => {
  const [expanded, setExpanded] = useState(false);
  const colorClass = color === 'blue'
    ? 'skandia-tooltip-blue'
    : color === 'amber'
    ? 'skandia-tooltip-amber'
    : 'skandia-tooltip-green';

  return (
    <div
      className={`mt-3 ${colorClass} cursor-pointer select-none`}
      onClick={() => setExpanded(!expanded)}
    >
      <Info className="w-4 h-4 flex-shrink-0" />
      <p className={`flex-1 ${expanded ? '' : 'line-clamp-1'}`}>{content}</p>
      <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
    </div>
  );
};

export default SkandiaTooltip;
