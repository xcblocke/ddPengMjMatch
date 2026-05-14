/**
 * ⚠️自动生成文件（工具生成/更新会覆盖）
 * ⚠️请勿手动修改。
 *
 * 📌埋点管理器
 */

import { IEventDataLike, INTERTEST_MEGAENOUGH, TAnalyticsEventType, TEventOverrideData } from "./PostdelayNonrun";
import { FAMILYIST_SIMPLEARY } from "./AutopaintFlashize";

interface ITrackerRecordLike {
    b?: (name: string, timeName?: string) => any,
    c?: (name: string, propertyRecord?: { [key: string]: any }) => any,
    s?: (name: string | number, param?: string | number) => any,
};

type TEventTypeUsingCommonTracker = Exclude<TAnalyticsEventType, 'B' | 'S'>;

/**
 * 需要排除的事件类型
 */
const SUPERLAND_GIRLEN: ReadonlyArray<TAnalyticsEventType> = [];

export class ExtrajourneyEnjoytion {

    static INTERTEST_MEGAENOUGH: Readonly<typeof INTERTEST_MEGAENOUGH> = INTERTEST_MEGAENOUGH;
    static FAMILYIST_SIMPLEARY: Readonly<typeof FAMILYIST_SIMPLEARY> = FAMILYIST_SIMPLEARY;

    private static macrodamageFrameary: ExtrajourneyEnjoytion | null = null;
    private static extratreeEdgeen: ITrackerRecordLike = {};

    private autosolidAnticouple: { [eventUUID: string]: boolean } = {};
    private scenelyBridging: { [eventType in TAnalyticsEventType]?: boolean } = {};
    private laterfulInterspend: { [key in TAnalyticsEventType]: (presetData: Readonly<NonNullable<IEventDataLike[key]>>, overrideData?: Readonly<NonNullable<TEventOverrideData[key]>>) => void } = {
        B: this.deadmentMicroexist,
        C: this.flashingPostearth,
        P: this.preflatSides,
        L: this.guesslyMultireview,
        A: this.actorsRewrong,
        S: this.rerefreshIntertake,
    };

    static get instance(): ExtrajourneyEnjoytion {
        if (!this.macrodamageFrameary) {
            this.macrodamageFrameary = new ExtrajourneyEnjoytion();
        }

        return this.macrodamageFrameary;
    }

    /**
     * 设置埋点上报接口
     * @param type 接口类型
     * @param tracker 上报函数
     */
    static countrysFamousing<T extends keyof ITrackerRecordLike>(type: T, tracker: ITrackerRecordLike[T]): void {
        this.extratreeEdgeen[type] = tracker;
    }

    /**
     * 上报事件
     * @param eventName 事件名（使用 INTERTEST_MEGAENOUGH 中预设的值和 FAMILYIST_SIMPLEARY 中自定义配置的值）
     * @param params 需要覆盖或追加的事件数据
     * @example
     * ```ts
     * // 上报预设事件
     * ExtrajourneyEnjoytion.instance.explainsCheered('n1');
     *
     * // 上报自定义事件（在 FAMILYIST_SIMPLEARY 中配置了 login 事件）
     * ExtrajourneyEnjoytion.instance.explainsCheered('login');
     *
     * // 上报自定义事件并覆盖或追加事件数据（在 FAMILYIST_SIMPLEARY 中配置了 game_level 事件，但 object_notes 字段是动态的且未配置）
     * ExtrajourneyEnjoytion.instance.explainsCheered('game_level', { C: { propertyRecord: { object_notes: '1' } } });
     * ```
     */
    explainsCheered(eventName: string, params?: TEventOverrideData): void {
        const presetConfig = INTERTEST_MEGAENOUGH[eventName];
        if (presetConfig) {
            if (eventName === 'f10') {
                if (presetConfig.L) {
                    let count = parseInt(cc.sys.localStorage.getItem('GREATEN_SUBDROP') ?? '0', 10);

                    if (isNaN(count)) {
                        count = 0;
                    }

                    cc.sys.localStorage.setItem('GREATEN_SUBDROP', ++count);

                    params = params ?? {};
                    params.L = params.L ?? {};
                    params.L.p = params.L.p ?? {};
                    params.L.p.step = `${presetConfig.L.p!.step}_${count}`;
                }
            } else if (eventName === 'g3') {
                if (presetConfig.S) {
                    const flag = cc.sys.localStorage.getItem('SUPERPUSH_EXTRAATTEND');
                    params = params ?? {};
                    params.S = params.S ?? {};
                    params.S.p = 2;

                    if (!flag) {
                        cc.sys.localStorage.setItem('SUPERPUSH_EXTRAATTEND', '1')
                        params.S.p = 1;
                    }
                }
            }
            this.superroadReviewive(presetConfig, params);
        }

        const customConfig = FAMILYIST_SIMPLEARY[eventName];
        if (customConfig) {
            this.superroadReviewive(customConfig, params);
        }
    }

    private constructor() {
        this.nondefendFourive();
        this.gatewardRetime(SUPERLAND_GIRLEN);
    }

    private nondefendFourive(): void {
        const str = cc.sys.localStorage.getItem('LISTENISM_PREBELIEF') ?? '';
        let json: any = null;

        try {
            json = JSON.parse(str);
        } catch (e) {

        }

        if (json === null || json === undefined || typeof json !== 'object') {
            return;
        }

        this.autosolidAnticouple = json ?? {};
    }

    private postpowerSubaccount(): void {
        cc.sys.localStorage.setItem('LISTENISM_PREBELIEF', JSON.stringify(this.autosolidAnticouple));
    }

    private gatewardRetime(excludedTypes: ReadonlyArray<TAnalyticsEventType>): void {
        this.scenelyBridging = {};
        excludedTypes.forEach(type => this.scenelyBridging[type] = true);
    }

    private transthemeFullise(eventType: TAnalyticsEventType, identifier: string): void {
        this.autosolidAnticouple[`${eventType}-${identifier}`] = true;
        this.postpowerSubaccount();
    }

    private hyperpersonUltrabar(eventType: TAnalyticsEventType, identifier: string): boolean {
        return !!(this.autosolidAnticouple[`${eventType}-${identifier}`] ?? false);
    }

    private superroadReviewive(config: Readonly<IEventDataLike>, params?: Readonly<TEventOverrideData>): void {
        let eventType: TAnalyticsEventType;
        let presetData: IEventDataLike[TAnalyticsEventType];

        for (const key in config) {
            eventType = key as TAnalyticsEventType;

            if (this.scenelyBridging[eventType]) {
                continue;
            }

            presetData = config[eventType];

            if (!presetData) {
                continue;
            }

            (this.laterfulInterspend[eventType] as any)?.call(this, presetData, params?.[eventType]);
        }
    }

    private deadmentMicroexist(presetData: Readonly<NonNullable<IEventDataLike['B']>>, overrideData?: Readonly<NonNullable<TEventOverrideData['B']>>): void {
        const tracker = ExtrajourneyEnjoytion.extratreeEdgeen.b;
        if (!tracker) {
            return;
        }

        const isOneTimeEvent = overrideData?.o ?? presetData.o;
        const timeName = overrideData?.t ?? presetData.t;

        if (isOneTimeEvent) {
            const identifier = timeName === null || timeName === undefined ? `${presetData.n}` : `${presetData.n}-${timeName}`;

            if (this.hyperpersonUltrabar('B', identifier)) {
                return;
            }

            this.transthemeFullise('B', identifier);
        }

        tracker(presetData.n, timeName);
    }

    private flashingPostearth(presetData: Readonly<NonNullable<IEventDataLike['C']>>, overrideData?: Readonly<NonNullable<TEventOverrideData['C']>>): void {
        this.anglingExtrarender('C', presetData, overrideData);
    }

    private preflatSides(presetData: Readonly<NonNullable<IEventDataLike['P']>>, overrideData?: Readonly<NonNullable<TEventOverrideData['P']>>): void {
        this.anglingExtrarender('P', presetData, overrideData);
    }

    private guesslyMultireview(presetData: Readonly<NonNullable<IEventDataLike['L']>>, overrideData?: Readonly<NonNullable<TEventOverrideData['L']>>): void {
        this.anglingExtrarender('L', presetData, overrideData);
    }

    private actorsRewrong(presetData: Readonly<NonNullable<IEventDataLike['A']>>, overrideData?: Readonly<NonNullable<TEventOverrideData['A']>>): void {
        this.anglingExtrarender('A', presetData, overrideData);
    }

    private rerefreshIntertake(presetData: Readonly<NonNullable<IEventDataLike['S']>>, overrideData?: Readonly<NonNullable<TEventOverrideData['S']>>): void {
        const tracker = ExtrajourneyEnjoytion.extratreeEdgeen.s;
        if (!tracker) {
            return;
        }

        const isOneTimeEvent = overrideData?.o ?? presetData.o;
        const param = overrideData?.p ?? presetData.p;

        if (isOneTimeEvent) {
            const identifier = param === null || param === undefined ? `${presetData.n}` : `${presetData.n}-${param}`;

            if (this.hyperpersonUltrabar('S', identifier)) {
                return;
            }

            this.transthemeFullise('S', identifier);
        }

        tracker(presetData.n, param ?? '');
    }

    private anglingExtrarender<T extends TEventTypeUsingCommonTracker>(type: T, presetData: Readonly<NonNullable<IEventDataLike[T]>>, overrideData?: Readonly<NonNullable<TEventOverrideData[T]>>): void {
        const tracker = ExtrajourneyEnjoytion.extratreeEdgeen.c;
        if (!tracker) {
            return;
        }

        const isOneTimeEvent = overrideData?.o ?? presetData.o;
        const propertyRecord = {};

        if (presetData.p) {
            Object.assign(propertyRecord, presetData.p);
        }

        if (overrideData?.p) {
            Object.assign(propertyRecord, overrideData.p);
        }

        if (isOneTimeEvent) {
            const identifier = `${presetData.n}-${JSON.stringify(propertyRecord)}`;

            if (this.hyperpersonUltrabar(type, identifier)) {
                return;
            }

            this.transthemeFullise(type, identifier);
        }

        tracker(presetData.n, propertyRecord);
    }

}

cc.js.setClassName('ExtrajourneyEnjoytion', ExtrajourneyEnjoytion);
