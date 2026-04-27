export default class AdSchedule extends cc.Component {
  startSchedule(e) {
    this.scheduleOnce(function () {
      e();
    }, 3);
  }
  stopSchedule() {
    this.unscheduleAllCallbacks();
  }
}