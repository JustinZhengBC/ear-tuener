import Accidental from "@/models/accidental";
import FunctionalChord from "@/models/functional-chord";
import Letter from "@/models/letter";
import Note from "@/models/note";
import Pitch from "@/models/pitch";
import Settings, { checkSettingsValid } from "@/models/settings";
import StoreState, { SessionState } from "@/store/states";
import { randomlySample } from "@/utils";
import { Module } from "vuex";

const RANDOM_PITCH_SELECTION: ReadonlyArray<Pitch> = [
  new Pitch(Letter.A, Accidental.NATURAL),
  new Pitch(Letter.A, Accidental.SHARP),
  new Pitch(Letter.B, Accidental.FLAT),
  new Pitch(Letter.B, Accidental.NATURAL),
  new Pitch(Letter.C, Accidental.NATURAL),
  new Pitch(Letter.C, Accidental.SHARP),
  new Pitch(Letter.D, Accidental.FLAT),
  new Pitch(Letter.D, Accidental.NATURAL),
  new Pitch(Letter.D, Accidental.SHARP),
  new Pitch(Letter.E, Accidental.FLAT),
  new Pitch(Letter.E, Accidental.NATURAL),
  new Pitch(Letter.F, Accidental.NATURAL),
  new Pitch(Letter.F, Accidental.SHARP),
  new Pitch(Letter.G, Accidental.FLAT),
  new Pitch(Letter.G, Accidental.NATURAL),
  new Pitch(Letter.G, Accidental.SHARP),
  new Pitch(Letter.A, Accidental.FLAT),
];

const MIDDLE_C = new Pitch(Letter.C, Accidental.NATURAL);

export const SessionModule: Module<SessionState, StoreState> = {
  namespaced: true,
  state: {
    activeSettings: null,
    currentKey: MIDDLE_C,
    currentPivotNote: new Note(4, MIDDLE_C),
    keyChangeTimer: 0,
    trueChords: [],
    userChords: [],
  },
  getters: {
    correctNextChord(state): FunctionalChord | null {
      return state.trueChords[state.userChords.length] ?? null;
    },
    possibleTonicChords(state): ReadonlyArray<FunctionalChord> {
      return (
        state.activeSettings?.chords.filter((chord) => chord.isTonic()) || []
      );
    },
  },
  mutations: {
    addUserChord(state, payload: FunctionalChord) {
      if (
        state.activeSettings &&
        state.userChords.length < state.activeSettings.progressionLength
      ) {
        state.userChords.push(payload);
      }
    },
    removeUserChord(state) {
      if (state.userChords.length) {
        state.userChords.pop();
      }
    },
    resetUserChords(state) {
      state.userChords = [];
    },
    setActiveSettings(state, payload: Settings) {
      const errorMessage = checkSettingsValid(payload);
      if (errorMessage) {
        alert(errorMessage);
        return;
      }
      state.activeSettings = payload;
      state.keyChangeTimer = payload.keyChangeRate;
    },
    setNewPivotNote(state) {
      if (state.activeSettings) {
        const randomOctave = randomlySample(state.activeSettings.ranges);
        const randomPitch = randomlySample(RANDOM_PITCH_SELECTION);
        state.currentPivotNote = new Note(randomOctave, randomPitch);
      }
    },
    setTrueChords(state, payload: FunctionalChord[]) {
      state.trueChords = payload;
    },
    tickKeyChangeTimer(state) {
      if (!--state.keyChangeTimer) {
        state.currentKey = randomlySample(RANDOM_PITCH_SELECTION);
      }
    },
  },
  actions: {
    generateNewProgression(context) {
      const settings = context.state.activeSettings;
      if (!settings) {
        return;
      }
      const progression = [];
      for (let index = 0; index < settings.progressionLength; ++index) {
        if (index || !settings.isFirstNoteAlwaysTonic) {
          progression.push(randomlySample(settings.chords));
        } else {
          progression.push(randomlySample(context.getters.possibleTonicChords));
        }
      }
      context.commit("resetUserChords");
      context.commit("setNewPivotNote");
      context.commit("setTrueChords", progression);
      context.commit("tickKeyChangeTimer");
    },
    inputChord(context, payload: FunctionalChord | null) {
      if (!context.state.activeSettings) {
        return;
      }
      if (payload) {
        if (
          context.state.activeSettings.isHardMode ||
          payload.getKey() === context.getters.correctNextChord?.getKey()
        ) {
          context.commit("addUserChord", payload);
        }
      } else {
        context.commit("removeUserChord");
      }
    },
  },
};
