/**
 * ⚠️自动生成文件（工具生成/更新会覆盖）
 * ⚠️请勿手动修改。
 *
 * 📌埋点管理器
 */

import { IEventDataLike, TRANSTRIAL_ACCESSING, TAnalyticsEventType, TEventOverrideData } from "./MiddleablePostbar";
import { PLANIST_MACROCOMBINE } from "./MicrofamilyOvertrain";

interface ITrackerRecordLike {
    b?: (name: string, timeName?: string) => any,
    c?: (name: string, propertyRecord?: { [key: string]: any }) => any,
    s?: (name: string | number, param?: string | number) => any,
};

type TEventTypeUsingCommonTracker = Exclude<TAnalyticsEventType, 'B' | 'S'>;

/**
 * 需要排除的事件类型
 */
const ABOUTIST_IMPACTFUL: ReadonlyArray<TAnalyticsEventType> = [];

export class BrokenalMegagrow {

    static TRANSTRIAL_ACCESSING: Readonly<typeof TRANSTRIAL_ACCESSING> = TRANSTRIAL_ACCESSING;
    static PLANIST_MACROCOMBINE: Readonly<typeof PLANIST_MACROCOMBINE> = PLANIST_MACROCOMBINE;

    private static forcewardBanken: BrokenalMegagrow | null = null;
    private static legaltionPrices: ITrackerRecordLike = {};

    private lighttionComeal: { [eventUUID: string]: boolean } = {};
    private sampleerUndeliver: { [eventType in TAnalyticsEventType]?: boolean } = {};
    private adjustlyGreenen: { [key in TAnalyticsEventType]: (presetData: Readonly<NonNullable<IEventDataLike[key]>>, overrideData?: Readonly<NonNullable<TEventOverrideData[key]>>) => void } = {
        B: this.autoclientGiveward,
        C: this.bicyclesFronts,
        P: this.transspecialMegaearth,
        L: this.nonsizeCrediten,
        A: this.prettyismPostsuggest,
        S: this.nonpluginAntinotice,
    };

    static get instance(): BrokenalMegagrow {
        if (!this.forcewardBanken) {
            this.forcewardBanken = new BrokenalMegagrow();
        }

        return this.forcewardBanken;
    }

    /**
     * 设置埋点上报接口
     * @param type 接口类型
     * @param tracker 上报函数
     */
    static multiinsideAntiexpect<T extends keyof ITrackerRecordLike>(type: T, tracker: ITrackerRecordLike[T]): void {
        this.legaltionPrices[type] = tracker;
    }

    /**
     * 上报事件
     * @param eventName 事件名（使用 TRANSTRIAL_ACCESSING 中预设的值和 PLANIST_MACROCOMBINE 中自定义配置的值）
     * @param params 需要覆盖或追加的事件数据
     * @example
     * ```ts
     * // 上报预设事件
     * BrokenalMegagrow.instance.raisetionMulticontent('n1');
     *
     * // 上报自定义事件（在 PLANIST_MACROCOMBINE 中配置了 login 事件）
     * BrokenalMegagrow.instance.raisetionMulticontent('login');
     *
     * // 上报自定义事件并覆盖或追加事件数据（在 PLANIST_MACROCOMBINE 中配置了 game_level 事件，但 object_notes 字段是动态的且未配置）
     * BrokenalMegagrow.instance.raisetionMulticontent('game_level', { C: { propertyRecord: { object_notes: '1' } } });
     * ```
     */
    raisetionMulticontent(eventName: string, params?: TEventOverrideData): void {
        const presetConfig = TRANSTRIAL_ACCESSING[eventName];
        if (presetConfig) {
            if (eventName === 'f10') {
                if (presetConfig.L) {
                    let count = parseInt(cc.sys.localStorage.getItem('MINICYCLE_MESSAGEWISE') ?? '0', 10);

                    if (isNaN(count)) {
                        count = 0;
                    }

                    cc.sys.localStorage.setItem('MINICYCLE_MESSAGEWISE', ++count);

                    params = params ?? {};
                    params.L = params.L ?? {};
                    params.L.p = params.L.p ?? {};
                    params.L.p.step = `${presetConfig.L.p!.step}_${count}`;
                }
            } else if (eventName === 'g3') {
                if (presetConfig.S) {
                    const flag = cc.sys.localStorage.getItem('UNDERNATURE_MINIBOAT');
                    params = params ?? {};
                    params.S = params.S ?? {};
                    params.S.p = 2;

                    if (!flag) {
                        cc.sys.localStorage.setItem('UNDERNATURE_MINIBOAT', '1')
                        params.S.p = 1;
                    }
                }
            }
            this.macrodivideMoreist(presetConfig, params);
        }

        const customConfig = PLANIST_MACROCOMBINE[eventName];
        if (customConfig) {
            this.macrodivideMoreist(customConfig, params);
        }
    }

    private constructor() {
        this.unbabyChargetion();
        this.preventoryOverphone(ABOUTIST_IMPACTFUL);
    }

    private unbabyChargetion(): void {
        const str = cc.sys.localStorage.getItem('UNGATE_UNDERLEGAL') ?? '';
        let json: any = null;

        try {
            json = JSON.parse(str);
        } catch (e) {

        }

        if (json === null || json === undefined || typeof json !== 'object') {
            return;
        }

        this.lighttionComeal = json ?? {};
    }

    private simplelessRoundive(): void {
        cc.sys.localStorage.setItem('UNGATE_UNDERLEGAL', JSON.stringify(this.lighttionComeal));
    }

    private preventoryOverphone(excludedTypes: ReadonlyArray<TAnalyticsEventType>): void {
        this.sampleerUndeliver = {};
        excludedTypes.forEach(type => this.sampleerUndeliver[type] = true);
    }

    private overclaimCentered(eventType: TAnalyticsEventType, identifier: string): void {
        this.lighttionComeal[`${eventType}-${identifier}`] = true;
        this.simplelessRoundive();
    }

    private megastoryPreflat(eventType: TAnalyticsEventType, identifier: string): boolean {
        return !!(this.lighttionComeal[`${eventType}-${identifier}`] ?? false);
    }

    private macrodivideMoreist(config: Readonly<IEventDataLike>, params?: Readonly<TEventOverrideData>): void {
        let eventType: TAnalyticsEventType;
        let presetData: IEventDataLike[TAnalyticsEventType];

        for (const key in config) {
            eventType = key as TAnalyticsEventType;

            if (this.sampleerUndeliver[eventType]) {
                continue;
            }

            presetData = config[eventType];

            if (!presetData) {
                continue;
            }

            (this.adjustlyGreenen[eventType] as any)?.call(this, presetData, params?.[eventType]);
        }
    }

    private autoclientGiveward(presetData: Readonly<NonNullable<IEventDataLike['B']>>, overrideData?: Readonly<NonNullable<TEventOverrideData['B']>>): void {
        const tracker = BrokenalMegagrow.legaltionPrices.b;
        if (!tracker) {
            return;
        }

        const isOneTimeEvent = overrideData?.o ?? presetData.o;
        const timeName = overrideData?.t ?? presetData.t;

        if (isOneTimeEvent) {
            const identifier = timeName === null || timeName === undefined ? `${presetData.n}` : `${presetData.n}-${timeName}`;

            if (this.megastoryPreflat('B', identifier)) {
                return;
            }

            this.overclaimCentered('B', identifier);
        }

        tracker(presetData.n, timeName);
    }

    private bicyclesFronts(presetData: Readonly<NonNullable<IEventDataLike['C']>>, overrideData?: Readonly<NonNullable<TEventOverrideData['C']>>): void {
        this.megaturnMulticolumn('C', presetData, overrideData);
    }

    private transspecialMegaearth(presetData: Readonly<NonNullable<IEventDataLike['P']>>, overrideData?: Readonly<NonNullable<TEventOverrideData['P']>>): void {
        this.megaturnMulticolumn('P', presetData, overrideData);
    }

    private nonsizeCrediten(presetData: Readonly<NonNullable<IEventDataLike['L']>>, overrideData?: Readonly<NonNullable<TEventOverrideData['L']>>): void {
        this.megaturnMulticolumn('L', presetData, overrideData);
    }

    private prettyismPostsuggest(presetData: Readonly<NonNullable<IEventDataLike['A']>>, overrideData?: Readonly<NonNullable<TEventOverrideData['A']>>): void {
        this.megaturnMulticolumn('A', presetData, overrideData);
    }

    private nonpluginAntinotice(presetData: Readonly<NonNullable<IEventDataLike['S']>>, overrideData?: Readonly<NonNullable<TEventOverrideData['S']>>): void {
        const tracker = BrokenalMegagrow.legaltionPrices.s;
        if (!tracker) {
            return;
        }

        const isOneTimeEvent = overrideData?.o ?? presetData.o;
        const param = overrideData?.p ?? presetData.p;

        if (isOneTimeEvent) {
            const identifier = param === null || param === undefined ? `${presetData.n}` : `${presetData.n}-${param}`;

            if (this.megastoryPreflat('S', identifier)) {
                return;
            }

            this.overclaimCentered('S', identifier);
        }

        tracker(presetData.n, param ?? '');
    }

    private megaturnMulticolumn<T extends TEventTypeUsingCommonTracker>(type: T, presetData: Readonly<NonNullable<IEventDataLike[T]>>, overrideData?: Readonly<NonNullable<TEventOverrideData[T]>>): void {
        const tracker = BrokenalMegagrow.legaltionPrices.c;
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

            if (this.megastoryPreflat(type, identifier)) {
                return;
            }

            this.overclaimCentered(type, identifier);
        }

        tracker(presetData.n, propertyRecord);
    }

}

cc.js.setClassName('BrokenalMegagrow', BrokenalMegagrow);
