import { motion } from 'framer-motion';

interface SamiBubbleProps {
  text: string;
  type?: 'default' | 'gold';
}

const SamiBubble = ({ text, type = 'default' }: SamiBubbleProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="flex gap-4 mb-8 items-start"
  >
    <div className="w-10 h-10 rounded-full bg-skandia-green-bg flex items-center justify-center flex-shrink-0 border border-border">
      <span className="text-[10px] font-bold text-grey-500 font-display">SAMI</span>
    </div>
    <div className={type === 'gold' ? 'sami-bubble-gold' : 'sami-bubble'}>
      <p className="text-foreground leading-relaxed text-[15px]">{text}</p>
    </div>
  </motion.div>
);

export default SamiBubble;
