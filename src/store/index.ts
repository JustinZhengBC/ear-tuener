import { createStore } from "vuex";
import { namespace } from "vuex-class";
import { SessionModule } from "@/store/modules/session";
import { SettingsModule } from "@/store/modules/settings";
import StoreState from "@/store/states";

export const session = namespace("session");
export const settings = namespace("settings");

export default createStore<StoreState>({
  modules: {
    session: SessionModule,
    settings: SettingsModule,
  },
});
