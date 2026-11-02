// Renders begena strings off the main thread so typing never stutters.
import { renderBegenaVoice, BEGENA_STRINGS, RENDER_RATE } from './voice.js';

self.onmessage = () => {
  // Every string once first, then the extra pluck variants
  for (let variant = 0; variant < 2; variant++) {
    for (let string = 0; string < BEGENA_STRINGS.length; string++) {
      const data = renderBegenaVoice(string, variant, RENDER_RATE);
      self.postMessage({ string, variant, sampleRate: RENDER_RATE, data }, [data.buffer]);
    }
  }
};
