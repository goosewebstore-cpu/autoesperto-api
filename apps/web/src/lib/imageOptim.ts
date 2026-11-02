const ANALYSIS_MAX_DIMENSION = 1600;

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Impossibile leggere la foto.'));
    reader.readAsDataURL(file);
  });
}

export async function optimiseImageForAnalysis(file: File): Promise<string> {
  const source = await readFileAsDataURL(file);
  if (typeof Image === 'undefined') return source;

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
      if (!longestSide || longestSide <= ANALYSIS_MAX_DIMENSION) {
        resolve(source);
        return;
      }

      const scale = ANALYSIS_MAX_DIMENSION / longestSide;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.naturalWidth * scale);
      canvas.height = Math.round(image.naturalHeight * scale);
      const context = canvas.getContext('2d');
      if (!context) {
        resolve(source);
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.84));
    };
    image.onerror = () => resolve(source);
    image.src = source;
  });
}