import { A } from '../centerio/api';

/** Creator 后台埋点（470+），事件名与 SDY id 一致，动态参数走 S.p */
export function trackCreatorEvent(eventId: number, notes?: string | number): void {
  try {
    const eventName = String(eventId);
    console.log("trackCreatorEvent...................", eventName, notes);
    if (notes !== undefined && notes !== null && String(notes) !== '') {
      A.t(eventName, { S: { p: String(notes) } });
    } else {
      A.t(eventName);
    }
  } catch (_e) {}
}
