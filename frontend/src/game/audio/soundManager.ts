import { Howl } from "howler";

const createToneDataUri = (
  frequency: number,
  durationSec: number,
  volume = 0.35,
  type: OscillatorType = "sine",
): string => {
  const sampleRate = 22050;
  const numSamples = Math.floor(sampleRate * durationSec);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, numSamples * 2, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.min(1, (numSamples - i) / (sampleRate * 0.05));
    let sample = 0;

    if (type === "sine") {
      sample = Math.sin(2 * Math.PI * frequency * t);
    } else if (type === "square") {
      sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
    } else {
      sample = Math.random() * 2 - 1;
    }

    const intSample = Math.max(
      -32767,
      Math.min(32767, sample * volume * envelope * 32767),
    );
    view.setInt16(44 + i * 2, intSample, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return `data:audio/wav;base64,${btoa(binary)}`;
};

const reelStopSound = new Howl({
  src: [createToneDataUri(180, 0.06, 0.5, "square")],
  volume: 0.35,
});

const winSound = new Howl({
  src: [createToneDataUri(523, 0.18, 0.4, "sine")],
  volume: 0.45,
});

const bigWinSound = new Howl({
  src: [createToneDataUri(784, 0.35, 0.45, "sine")],
  volume: 0.5,
});

const scatterSound = new Howl({
  src: [createToneDataUri(880, 0.25, 0.4, "sine")],
  volume: 0.5,
});

const freeSpinsSound = new Howl({
  src: [createToneDataUri(660, 0.4, 0.45, "sine")],
  volume: 0.55,
});

export const playReelStop = () => {
  reelStopSound.stop();
  reelStopSound.play();
};

export const playWin = (amount: number, bet: number) => {
  if (amount >= bet * 20) {
    bigWinSound.stop();
    bigWinSound.play();
    return;
  }

  winSound.stop();
  winSound.play();
};

export const playScatter = () => {
  scatterSound.stop();
  scatterSound.play();
};

export const playFreeSpins = () => {
  freeSpinsSound.stop();
  freeSpinsSound.play();
};
