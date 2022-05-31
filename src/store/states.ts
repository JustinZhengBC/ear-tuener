import FunctionalChord from "@/models/functional-chord";
import Note from "@/models/note";
import Pitch from "@/models/pitch";
import Settings from "@/models/settings";

export interface SessionState {
  activeSettings: Settings | null;
  currentKey: Pitch;
  currentPivotNote: Note;
  keyChangeTimer: number;
  trueChords: FunctionalChord[];
  userChords: FunctionalChord[];
}

export interface SettingsState {
  settingsList: Settings[] | null;
}

export default interface StoreState {
  session: SessionState;
  settings: SettingsState;
}
