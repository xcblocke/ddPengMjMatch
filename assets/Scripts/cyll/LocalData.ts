import PlayerDataSys from '../framework/controller/PlayerDataSys';
export default class LocalData {
  expensesData = [];
  static _instance = null;
  static getInstance() {
    this._instance || (this._instance = new LocalData());
    return this._instance;
  }
  initData() {
    cc.sys.localStorage.getItem("expensesData") || cc.sys.localStorage.setItem("expensesData", JSON.stringify([]));
    cc.sys.localStorage.getItem("earnData") || cc.sys.localStorage.setItem("earnData", JSON.stringify([]));
    cc.sys.localStorage.getItem("planData") || cc.sys.localStorage.setItem("planData", JSON.stringify([]));
    cc.sys.localStorage.getItem("showHideState") || cc.sys.localStorage.setItem("showHideState", "false");
  }
  getexpensesData() {
    return JSON.parse(cc.sys.localStorage.getItem("expensesData"));
  }
  setexpensesData(e) {
    cc.sys.localStorage.setItem("expensesData", JSON.stringify(e));
  }
  getearnData() {
    return JSON.parse(cc.sys.localStorage.getItem("earnData"));
  }
  setearnData(e) {
    cc.sys.localStorage.setItem("earnData", JSON.stringify(e));
  }
  getplanData() {
    return JSON.parse(cc.sys.localStorage.getItem("planData"));
  }
  setplanData(e) {
    cc.sys.localStorage.setItem("planData", JSON.stringify(e));
  }
  getShowHideState() {
    return JSON.parse(cc.sys.localStorage.getItem("showHideState"));
  }
  setShowHideState(e) {
    cc.sys.localStorage.setItem("showHideState", e);
  }
  getGameLevel2Guide() {
    return JSON.parse(cc.sys.localStorage.getItem("showGudeLevel2_" + PlayerDataSys.userid));
  }
  setGameLevel2Guide(e) {
    cc.sys.localStorage.setItem("showGudeLevel2_" + PlayerDataSys.userid, e);
  }
  getUserCoinData() {
    return JSON.parse(cc.sys.localStorage.getItem("userCoinData"));
  }
  setUserCoinData(e) {
    cc.sys.localStorage.setItem("userCoinData", e);
  }
  getDebugData() {
    return JSON.parse(cc.sys.localStorage.getItem("debugData"));
  }
  setDebugData(e) {
    console.log("setDebugData", e);
    cc.sys.localStorage.setItem("debugData", e);
  }
  setPlayGuide(e) {
    cc.sys.localStorage.setItem("playGuide", JSON.stringify(e));
  }
  getPlayGuide() {
    return JSON.parse(cc.sys.localStorage.getItem("playGuide"));
  }
}
export var gameData = LocalData.getInstance();