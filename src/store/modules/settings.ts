import ChordQuality from "@/models/chord-quality";
import Degree from "@/models/degree";
import FunctionalChord from "@/models/functional-chord";
import Settings, {
  checkSettingsValid,
  DEFAULT_SETTINGS,
  parseSettings,
  stringifySettings,
} from "@/models/settings";
import StoreState, { SettingsState } from "@/store/states";
import { Module } from "vuex";

const DEFAULT_SETTINGS_LIST: Settings[] = [
  {
    ...DEFAULT_SETTINGS,
    name: "Major (common)",
    chords: [
      new FunctionalChord(Degree.I, ChordQuality.MAJOR),
      new FunctionalChord(Degree.IV, ChordQuality.MAJOR),
      new FunctionalChord(Degree.V, ChordQuality.MAJOR),
      new FunctionalChord(Degree.VI, ChordQuality.MINOR),
    ],
  },
  {
    ...DEFAULT_SETTINGS,
    name: "Major (diatonic)",
    chords: [
      new FunctionalChord(Degree.I, ChordQuality.MAJOR),
      new FunctionalChord(Degree.II, ChordQuality.MINOR),
      new FunctionalChord(Degree.III, ChordQuality.MINOR),
      new FunctionalChord(Degree.IV, ChordQuality.MAJOR),
      new FunctionalChord(Degree.V, ChordQuality.MAJOR),
      new FunctionalChord(Degree.VI, ChordQuality.MINOR),
      new FunctionalChord(Degree.VII, ChordQuality.DIMINISHED),
    ],
  },
  {
    ...DEFAULT_SETTINGS,
    name: "Major (extended)",
    chords: [
      new FunctionalChord(Degree.I, ChordQuality.MAJOR),
      new FunctionalChord(Degree.II, ChordQuality.MINOR),
      new FunctionalChord(Degree.III, ChordQuality.MINOR),
      new FunctionalChord(Degree.IV, ChordQuality.MAJOR),
      new FunctionalChord(Degree.V, ChordQuality.MAJOR),
      new FunctionalChord(Degree.VI, ChordQuality.MINOR),
      new FunctionalChord(Degree.VII, ChordQuality.DIMINISHED),
      new FunctionalChord(Degree.II_FLAT, ChordQuality.MAJOR), // neapolitan, tritone substitution for V
      new FunctionalChord(Degree.II, ChordQuality.MAJOR), // establishes lydian mode, secondary dominant for V
      new FunctionalChord(Degree.III, ChordQuality.MAJOR), // secondary dominant for vi
      new FunctionalChord(Degree.IV, ChordQuality.MINOR), // substitute for V
      new FunctionalChord(Degree.VI, ChordQuality.MAJOR), // secondary dominant for ii
      new FunctionalChord(Degree.VII_FLAT, ChordQuality.MAJOR), // establishes mixolydian mode
    ],
  },
  {
    ...DEFAULT_SETTINGS,
    name: "Major (sevenths)",
    chords: [
      new FunctionalChord(Degree.I, ChordQuality.MAJOR_SEVENTH),
      new FunctionalChord(Degree.II, ChordQuality.MINOR_SEVENTH),
      new FunctionalChord(Degree.III, ChordQuality.MINOR_SEVENTH),
      new FunctionalChord(Degree.IV, ChordQuality.MAJOR_SEVENTH),
      new FunctionalChord(Degree.V, ChordQuality.DOMINANT_SEVENTH),
      new FunctionalChord(Degree.VI, ChordQuality.MINOR_SEVENTH),
    ],
  },
  {
    ...DEFAULT_SETTINGS,
    name: "Minor",
    chords: [
      new FunctionalChord(Degree.I, ChordQuality.MINOR),
      new FunctionalChord(Degree.III_FLAT, ChordQuality.MAJOR),
      new FunctionalChord(Degree.IV, ChordQuality.MINOR),
      new FunctionalChord(Degree.V, ChordQuality.MAJOR),
      new FunctionalChord(Degree.V, ChordQuality.MINOR),
      new FunctionalChord(Degree.VI_FLAT, ChordQuality.MAJOR),
      new FunctionalChord(Degree.VII_FLAT, ChordQuality.MAJOR),
    ],
  },
];

const SETTINGS_KEY = "settings";

function parseSettingsList(
  stringifiedSettingsList: string | null
): Settings[] | null {
  if (!stringifiedSettingsList) {
    return null;
  }
  return JSON.parse(stringifiedSettingsList).map(parseSettings);
}

function stringifySettingsList(settings: Settings[]): string {
  return JSON.stringify(settings.map(stringifySettings));
}

export const SettingsModule: Module<SettingsState, StoreState> = {
  namespaced: true,
  state: { settingsList: [] },
  getters: {
    setting(state): (index: number) => Settings | null {
      return (settingsIndex: number) =>
        state.settingsList && state.settingsList[settingsIndex];
    },
  },
  mutations: {
    remove(state, index: number) {
      if (!state.settingsList) {
        throw new Error("Cannot remove before load");
      }
      state.settingsList.splice(index, 1);
    },
    resetSettings(state) {
      state.settingsList = DEFAULT_SETTINGS_LIST;
      window.localStorage.setItem(
        SETTINGS_KEY,
        stringifySettingsList(DEFAULT_SETTINGS_LIST)
      );
    },
    setSettings(state, payload: Settings[]) {
      state.settingsList = payload;
    },
    save(state, payload: { settings: Settings; index: number }) {
      const errorMessage = checkSettingsValid(payload.settings);
      if (errorMessage) {
        throw new Error("Invalid Settings: " + errorMessage);
      }
      if (!state.settingsList) {
        throw new Error("Cannot save before load");
      }
      state.settingsList[payload.index] = payload.settings;
    },
    saveAs(state, payload: Settings) {
      const errorMessage = checkSettingsValid(payload);
      if (errorMessage) {
        throw new Error("Invalid Settings: " + errorMessage);
      }
      if (!state.settingsList) {
        throw new Error("Cannot save before load");
      }
      state.settingsList.push(payload);
    },
  },
  actions: {
    addNew(context) {
      context.commit("saveAs", DEFAULT_SETTINGS);
    },
    load(context) {
      try {
        context.commit(
          "setSettings",
          parseSettingsList(window.localStorage.getItem(SETTINGS_KEY)) ||
            DEFAULT_SETTINGS_LIST
        );
      } catch {
        context.commit("setSettings", DEFAULT_SETTINGS_LIST);
      }
    },
    remove(context, payload: number) {
      context.commit("remove", payload);
      if (context.state.settingsList) {
        window.localStorage.setItem(
          SETTINGS_KEY,
          stringifySettingsList(context.state.settingsList)
        );
      }
    },
    save(context, payload: { settings: Settings; index: number }) {
      context.commit("save", payload);
      if (context.state.settingsList) {
        window.localStorage.setItem(
          SETTINGS_KEY,
          stringifySettingsList(context.state.settingsList)
        );
      }
    },
    saveAs(context, payload: Settings) {
      context.commit("saveAs", payload);
      if (context.state.settingsList) {
        window.localStorage.setItem(
          SETTINGS_KEY,
          stringifySettingsList(context.state.settingsList)
        );
      }
    },
  },
};
