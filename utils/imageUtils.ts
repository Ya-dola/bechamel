import { ImageFormat } from '@/enums/imageFormatEnum';
import { Area } from 'react-easy-crop';

/**
 * Crop the image using a canvas and return a File in the specified format with compression.
 * @param imageSrc - The image as a data URL.
 * @param pixelCrop - The cropping area in pixels.
 * @param quality - Optional quality factor (0 to 1) for compression; defaults to 0.8.
 * @param format - Output format as an ImageFormat enum; defaults to ImageFormat.WEBP.
 * @param originalFileName - Optional original file name. If provided, the output file name will be based on it.
 * @returns A Promise that resolves to a File with the new name appended with "-c.{format}".
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  quality: number = 0.8,
  originalFileName?: string,
  format: ImageFormat = ImageFormat.WEBP,
): Promise<File> {
  return new Promise<File>((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      );

      // Determine MIME type based on the format enum.
      let mimeType: string;
      if (format === ImageFormat.PNG) {
        mimeType = 'image/png';
      } else if (format === ImageFormat.JPEG) {
        mimeType = 'image/jpeg';
      } else {
        mimeType = 'image/webp';
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return reject(new Error('Canvas is empty'));
          }
          let baseName = 'cropped';
          if (originalFileName) {
            baseName = originalFileName.replace(/\.[^/.]+$/, '');
          }
          const fileName = `${baseName}-c.${format}`;
          const croppedFile = new File([blob], fileName, {
            type: mimeType,
          });
          resolve(croppedFile);
        },
        mimeType,
        quality,
      );
    };
    image.onerror = (error) => {
      reject(error);
    };
  });
}
