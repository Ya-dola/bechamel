import CustomIcon from '@/components/customIcon/customIcon';

interface CustomBadgeProps {
  text: string;
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
  borderRadius?: string;
  padding?: string;
  borderWidth?: string;
  borderStyle?: string;
  icon?: string;
  iconSize?: string;
  iconColor?: string;
  iconSpacing?: string;
}

function CustomBadge({
  text,
  textColor = 'text-gray-700',
  bgColor = 'bg-white',
  borderColor = 'border-gray-400',
  borderRadius = 'rounded-3xl',
  padding = 'px-3 py-1',
  borderWidth = 'border-2',
  borderStyle = 'border-solid',
  icon,
  iconSize = '22',
  iconColor = 'text-gray-700',
  iconSpacing = 'mr-1',
}: CustomBadgeProps) {
  return (
    <div
      className={`flex items-center justify-center h-fit w-fit ${padding} ${bgColor} ${borderWidth} ${borderStyle} ${borderColor} ${borderRadius}`}
    >
      {icon && (
        <CustomIcon
          icon={icon}
          iconSize={iconSize}
          iconColor={iconColor}
          iconSpacing={iconSpacing}
        />
      )}

      <p className={textColor}>{text}</p>
    </div>
  );
}

export default CustomBadge;
