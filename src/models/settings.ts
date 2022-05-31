import ChordQuality from "@/models/chord-quality";
import Degree from "@/models/degree";
import FunctionalChord from "@/models/functional-chord";

export enum KeyChangeRate {
  ONE = 1,
  FIVE = 5,
  TEN = 10,
  NEVER = 1e10, // Number.POSITIVE_INFINITY cannot be stringified
}

export enum Range {
  LOWEST = 1,
  LOWER = 2,
  LOW = 3,
  CENTER = 4,
  HIGH = 5,
  HIGHER = 6,
  HIGHEST = 7,
}

export enum Speed {
  SLOW = 1.5,
  MEDIUM = 1,
  FAST = 0.5,
}

export const DEFAULT_SETTINGS: Settings = {
  name: "New Settings",
  chords: [new FunctionalChord(Degree.I, ChordQuality.MAJOR)],
  keyChangeRate: KeyChangeRate.NEVER,
  ranges: [Range.LOW, Range.CENTER, Range.HIGH],
  speed: Speed.MEDIUM,
  progressionLength: 4,
  isFirstNoteAlwaysTonic: true,
  isHardMode: false,
};

export function checkSettingsValid(settings: Settings): string | null {
  if (
    settings.isFirstNoteAlwaysTonic &&
    settings.chords.every((chord) => !chord.isTonic())
  ) {
    return "First note should be tonic but no tonic chords were chosen.";
  } else if (!settings.name) {
    return "Name cannot be empty.";
  } else if (!settings.chords.length) {
    return "Chords cannot be empty.";
  } else if (!settings.ranges.length) {
    return "Ranges cannot be empty.";
  }
  return null;
}

export function stringifySettings(settings: Settings): string {
  return JSON.stringify({
    ...settings,
    chords: settings.chords.map((chord) => chord.stringify()).join(","),
  });
}

export function parseSettings(stringifiedSettings: string): Settings {
  const settings = JSON.parse(stringifiedSettings);
  return {
    ...settings,
    chords: settings.chords.split(",").map(FunctionalChord.parse),
  } as Settings;
}

export default interface Settings {
  name: string;
  chords: ReadonlyArray<FunctionalChord>;
  keyChangeRate: KeyChangeRate;
  ranges: ReadonlyArray<Range>;
  speed: Speed;
  progressionLength: number;
  isFirstNoteAlwaysTonic: boolean;
  isHardMode: boolean;
}
