interface IconCardProps {
  label: string;
  subText?: string;
  bgColor?: string;
  radius?: string;
  labelStyle?: string;
  labelColor?: string;
  subTextStyle?: string;
  subTextColor?: string;
}

function IconCard({
  label,
  subText,
  bgColor = 'bg-pink-200',
  radius = 'rounded-lg',
  labelColor: textColor = 'text-gray-700',
  labelStyle = `font-medium ${textColor}`,
  subTextColor = 'text-gray-900',
  subTextStyle = `font-semibold ${subTextColor}`,
}: IconCardProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center w-fit
         gap-1 p-4 fit-content ${bgColor} ${radius}`}
    >
      {/* TODO - Icon */}

      <p className={labelStyle}>{label}</p>

      {subText && <p className={subTextStyle}>{subText}</p>}
    </div>
  );
}

export default IconCard;
