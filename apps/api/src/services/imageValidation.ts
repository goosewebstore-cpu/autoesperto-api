import { z } from 'zod';

// Validate decoded signatures as well as the advertised MIME type before AI calls.
export const imageDataSchema = z.string().max(7_500_000).refine((value) => {
  const match = /^data:image\/(jpeg|jpg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match) return false;
  const bytes = Buffer.from(match[2], 'base64');
  if (bytes.length < 12 || bytes.length > 5_625_000) return false;
  if (match[1] === 'png') return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (match[1] === 'webp') return bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
  return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
}, 'Carica un file immagine JPG, PNG o WebP valido (massimo 5,6 MB).');
