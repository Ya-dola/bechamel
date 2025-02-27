import { Icon } from '@iconify/react';

interface IconCardProps {
  label: string;
  subText?: string;
  icon?: string;
  iconColor?: string;
  iconSize?: string;
  bgColor?: string;
  radius?: string;
  labelStyle?: string;
  labelColor?: string;
  subTextStyle?: string;
  subTextColor?: string;
  padding?: string;
  cardGap?: string;
}

function IconCard({
  label,
  subText,
  icon,
  iconColor = 'text-gray-700',
  iconSize = '24',
  bgColor = 'bg-pink-200',
  radius = 'rounded-lg',
  labelColor = 'text-gray-700',
  labelStyle = `font-medium ${labelColor}`,
  subTextColor = 'text-gray-900',
  subTextStyle = `font-semibold ${subTextColor}`,
  padding = 'p-3',
  cardGap = 'gap-1',
}: IconCardProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center h-fit w-fit fit-content ${cardGap} ${padding} ${bgColor} ${radius}`}
    >
      {icon && (
        <div className={`aspect-square w-${iconSize} h-${iconSize}`}>
          <Icon
            icon={icon}
            className={`${iconColor} w-full h-full`}
            height={iconSize}
            width={iconSize}
          />
        </div>
      )}

      <p className={labelStyle}>{label}</p>

      {subText && <p className={subTextStyle}>{subText}</p>}
    </div>
  );
}

export default IconCard;
