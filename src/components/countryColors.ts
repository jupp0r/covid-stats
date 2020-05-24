import {
  amber,
  blue,
  blueGrey,
  brown,
  cyan,
  green,
  grey,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
} from "@material-ui/core/colors";
import { murmur3 } from "murmurhash-js";

const colors = [
  red,
  pink,
  purple,
  blue,
  cyan,
  teal,
  green,
  lime,
  amber,
  orange,
  brown,
  grey,
  blueGrey,
];

const shades: (300 | 600)[] = [300, 600];

export const makeCountryColors = (isoCodes: string[]): Map<string, string> => {
  const results = new Map<string, string>();
  const pickedColors = new Set<string>();

  isoCodes.forEach(country => {
    let picked = "undefined";

    let hash = murmur3(country);
    // do multiple hash rounds to avoid collisions,
    // unless collisions are unavoidable with many countries
    do {
      hash = murmur3(hash.toString());
      const color: typeof colors[0] = colors[hash % colors.length];
      const shade: keyof typeof colors[0] = shades[hash % shades.length];

      picked = color[shade];
 
    } while (pickedColors.has(picked) && pickedColors.size < colors.length * shades.length);
   

    pickedColors.add(picked);
    results.set(country, picked);
  });

  return results;
};
