import { Icon } from '@iconify/react';

interface CustomIconProps {
  icon: string;
  iconSize?: string;
  iconColor?: string;
  iconSpacing?: string;
}

const CustomIcon = ({
  icon,
  iconSize = '24',
  iconColor = 'text-gray-700',
  iconSpacing = 'mr-1',
}: CustomIconProps) => {
  return (
    <div className={`aspect-square w-${iconSize} h-${iconSize} ${iconSpacing}`}>
      <Icon
        icon={icon}
        className={`w-full h-full ${iconColor}`}
        height={iconSize}
        width={iconSize}
      />
    </div>
  );
};

export default CustomIcon;
