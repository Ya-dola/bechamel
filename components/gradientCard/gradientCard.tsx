interface GradientCardProps {
  gradient?: string;
  flex?: string;
  padding?: string;
  className?: string;
  children?: React.ReactNode;
}

function GradientCard({
  gradient = 'bg-gradient-to-b from-violet-300 to-rose-400',
  flex = 'flex flex-col items-center justify-center gap-2',
  padding = 'px-8 py-4',
  className = 'h-fit w-fit rounded-xl',
  children,
}: GradientCardProps) {
  return (
    <div className={`${flex} ${padding} ${gradient} ${className}`}>
      {children}
    </div>
  );
}

export default GradientCard;
