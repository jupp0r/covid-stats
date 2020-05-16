import {
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
  brown,
  grey,
  blueGrey,
} from "@material-ui/core/colors";

import { murmur3 } from "murmurhash-js";

const colors = [
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
  brown,
  grey,
  blueGrey,
];

const shades = [300, 500, 900];

export const makeCountryColors = (isoCodes: string[]): Map<string, string> => {
  let results = new Map<string, string>();
  let pickedColors = new Set<string>();

  isoCodes.forEach(country => {
    let picked = "undefined";

    let hash = murmur3(country);
    // do multiple hash rounds to avoid collisions,
    // unless collisions are unavoidable with many countries
    do {
      hash = murmur3(hash.toString());
      const color = colors[hash % colors.length];
      const shade = shades[hash % shades.length];

      picked = (color as any)[shade.toString()];
 
      console.log(`picked color ${picked} for country ${country}`);
    } while (pickedColors.has(picked) && pickedColors.size < colors.length * shades.length);
   

    pickedColors.add(picked);
    results.set(country, picked);
  });

  return results;
};
