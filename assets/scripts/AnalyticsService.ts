import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('AnalyticsService')
export class AnalyticsService {
  static track(event: string, params: Record<string, string | number | boolean> = {}): void {
    // 线上可替换为神策/Firebase/自建埋点SDK
    // eslint-disable-next-line no-console
    console.log('[analytics]', event, params);
  }
}
