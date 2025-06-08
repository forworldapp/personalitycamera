// Image processing utilities for aging effects

export function applyAgingEffect(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Apply aging transformations
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Convert to grayscale for hair areas (top portion)
    const y = i / 4;
    const row = Math.floor(y / canvas.width);
    const isHairArea = row < canvas.height * 0.25;
    
    if (isHairArea) {
      // Add gray to hair
      const gray = (r + g + b) / 3;
      const grayFactor = 0.6;
      data[i] = Math.min(255, r + (gray - r) * grayFactor);
      data[i + 1] = Math.min(255, g + (gray - g) * grayFactor);
      data[i + 2] = Math.min(255, b + (gray - b) * grayFactor);
    } else {
      // Age skin tone - add yellow/brown tint
      data[i] = Math.min(255, r * 1.1 + 10); // Slightly increase red
      data[i + 1] = Math.min(255, g * 1.05 + 8); // Slightly increase green
      data[i + 2] = Math.max(0, b * 0.95 - 5); // Slightly decrease blue
    }
    
    // Add subtle texture noise for aged skin
    if (!isHairArea && Math.random() < 0.1) {
      const noise = (Math.random() - 0.5) * 20;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
  }
  
  context.putImageData(imageData, 0, 0);
  
  // Add wrinkles using canvas drawing
  addWrinkles(context, canvas.width, canvas.height);
}

function addWrinkles(context: CanvasRenderingContext2D, width: number, height: number): void {
  context.globalCompositeOperation = 'multiply';
  context.strokeStyle = 'rgba(101, 67, 33, 0.3)';
  context.lineWidth = 1;
  
  // Eye wrinkles
  const eyeY = height * 0.4;
  context.beginPath();
  context.moveTo(width * 0.2, eyeY);
  context.quadraticCurveTo(width * 0.25, eyeY + 5, width * 0.3, eyeY);
  context.moveTo(width * 0.7, eyeY);
  context.quadraticCurveTo(width * 0.75, eyeY + 5, width * 0.8, eyeY);
  context.stroke();
  
  // Forehead wrinkles
  const foreheadY = height * 0.25;
  context.beginPath();
  context.moveTo(width * 0.3, foreheadY);
  context.quadraticCurveTo(width * 0.5, foreheadY - 3, width * 0.7, foreheadY);
  context.stroke();
  
  // Smile lines
  const mouthY = height * 0.65;
  context.beginPath();
  context.moveTo(width * 0.35, mouthY);
  context.quadraticCurveTo(width * 0.4, mouthY + 8, width * 0.45, mouthY);
  context.moveTo(width * 0.55, mouthY);
  context.quadraticCurveTo(width * 0.6, mouthY + 8, width * 0.65, mouthY);
  context.stroke();
  
  context.globalCompositeOperation = 'source-over';
}

export function createAgedImage(originalImage: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      context.drawImage(img, 0, 0);
      
      // Apply aging effects
      applyAgingEffect(canvas, context);
      
      // Convert back to data URL
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.src = originalImage;
  });
}