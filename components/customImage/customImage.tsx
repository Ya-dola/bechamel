import { Image } from '@mantine/core';

interface CustomImageProps {
  imageSrc?: string;
  width?: number;
  height?: number;
  radius?: string;
  altName?: string;
}

function CustomImage({
  width = 500,
  radius = 'md',
  imageSrc = '',
  altName = 'altName',
}: CustomImageProps) {
  return (
    <Image
      alt={altName}
      radius={radius}
      h={'auto'}
      w={width}
      fit='contain'
      src={imageSrc}
    />
  );
}

export default CustomImage;
