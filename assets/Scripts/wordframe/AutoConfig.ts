import GameUtils from "./GameUtils";
export class AutoConfig {
  static _hotVersion = "1.11";
  static _hotVersionDebug = "1.114";
  static get hotVersion() {
    return GameUtils.getInstance().isDebug() ? this._hotVersionDebug : this._hotVersion;
  }
}