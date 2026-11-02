// Begena (በገና) notes for "Type with Begena".
//
// Real single notes cut from the solo-begena passages of
// "እንደ ጴጥሮስ እንደ ዮሀንስ" (ሱራፌል ወኪሩቤል), only where no voice is present,
// each retuned to its string and loudness-matched. They live in one sprite:
// /sounds/begena-notes.mp3.
//
// Tuning measured from the same song: a major pentatonic on E2+20c
// (1 2 3 5 6) with the low 6 below the root, spread over the ten strings.
// Strings 5, 6 and 8 had no clean solo note, so they use a neighbouring
// string's note shifted by about two semitones.

export const BEGENA_STRINGS = [71.0, 83.4, 94.2, 105.7, 124.5, 141.0, 167.5, 189.4, 211.4, 249.0];

export const BEGENA_SPRITE_URL = '/sounds/begena-notes.mp3';

// [string, variant, start seconds, duration seconds] in the sprite
export const BEGENA_NOTES = [
  [0, 0, 0.0, 1.812],
  [0, 1, 1.962, 1.122],
  [1, 0, 3.234, 1.8163],
  [1, 1, 5.2003, 0.7639],
  [2, 0, 6.1142, 0.5714],
  [2, 1, 6.8356, 0.6313],
  [3, 0, 7.6169, 0.8687],
  [3, 1, 8.6356, 0.3111],
  [4, 0, 9.0967, 0.614],
  [4, 1, 9.8607, 0.4724],
  [5, 0, 10.4831, 0.5421],
  [5, 1, 11.1752, 0.4171],
  [6, 0, 11.7423, 1.2916],
  [6, 1, 13.1839, 0.5862],
  [7, 0, 13.9201, 1.1423],
  [7, 1, 15.2124, 0.5184],
  [8, 0, 15.8808, 1.0234],
  [8, 1, 17.0542, 0.4645],
  [9, 0, 17.6686, 0.6105],
];

// QWERTY columns -> strings (left hand low, right hand high). Rows set how
// hard the string is plucked: number row strongest, bottom row softest.
const COLUMNS = ['1qaz', '2wsx', '3edc', '4rfv', '5tgb', '6yhn', '7ujm', '8ik,', '9ol.', "0p;/'-[]=:?"];
const ROW_VELOCITY = [1.0, 0.95, 0.85, 0.72];

export function keyToString(key) {
  if (!key) return null;
  if (key === ' ') return { string: 1, velocity: 0.55 }; // space: soft root string
  const k = key.toLowerCase();
  for (let col = 0; col < COLUMNS.length; col++) {
    const pos = COLUMNS[col].indexOf(k);
    if (pos !== -1) return { string: col, velocity: ROW_VELOCITY[Math.min(pos, 3)] };
  }
  return { string: 2, velocity: 0.8 };
}
