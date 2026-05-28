
import AutoImg from "./AutoImg";

interface IEventLike {
    object_action: string,
    object_name?: string,
    object_notes?: string,
};

const {
    ccclass,
    property
} = cc._decorator;
@ccclass
export default class newHand extends cc.Component {
    @property(cc.Sprite)
    progress: cc.Sprite = null;
    @property(cc.Label)
    labelBar: cc.Label = null;
    @property(cc.Label)
    labelBartips: cc.Label = null;
    @property(cc.Node)
    startButton: cc.Node = null;
    @property(cc.Node)
    light: cc.Node = null;
    @property(cc.Node)
    root1: cc.Node = null;
    @property(cc.Node)
    root2: cc.Node = null;


    @property(cc.ParticleSystem)
    particle: cc.ParticleSystem = null;
    // @property(sp.Skeleton)
    // doorSkeleton: sp.Skeleton = null;
    config = null;
    frameData: {
        gameName: string;
        frameEventCall: (eventName: string, eventData: any, once: boolean) => void;
        // logLiftEvent: Function;
        // logGameEvent: Function;
        // earlierStageEvent: Function;
        // sdyEvent: Function;
        reportEventCall: Function;
        showGameGuide: Function;
    } = null;

    init(config, frameData) {
        this.frameData = frameData;
        this.config = config;
        this.frameData.reportEventCall('g3');
        console.log('g3=========================',this.config);
    }

    protected onLoad(): void {
        this.startButton.active = false;
        this.light.active = false;
        this.progress.node.parent.active = true;
        this.root1.active = true;
        this.root2.active = false;

        this.frameData.frameEventCall("sdymjmatch_game_new", {
            object_action: "show",
            object_name: "new_1"
        }, true);

        this.openRoot2();
        let code = -1;
        this.schedule(() => {
            code = (code + 1) % 3;
            this.labelBartips.string = ".".repeat(code + 1);
        }, 0.5);
        this.progress.fillRange = 0;
        cc.tween(this.progress).to(5, {
            fillRange: 0.95
        }, {
            progress: (start, end, current, ratio) => {
                let num = start + (end - start) * ratio;
                this.labelBar.string = Math.floor(num * 100) + "%";
                return num;
            }
        }).start();
        this.schedule(this.getFrame);
        // if(this.doorSkeleton){
        //     this.doorSkeleton.setAnimation(0,"start",false);
        //     this.doorSkeleton.addAnimation(0, "loop", true);
        // }
        this.scheduleOnce(()=>{
            if(this.particle){
                this.particle.resetSystem();
            }
        },0)
    }

    openRoot1() {
        
        
        this.openEffect(this.root1);
        this.playEffect("YX_TC_01");
        cc.find("label", this.root1).getComponent(cc.Label).string = `nkey_001??&value1==${this.frameData.gameName}`;
        let r1 = this.randomFloat(10000, 50000);
        let r2 = this.formatNumber(r1 * this.randomFloat(10000, 20000));
        // cc.find("richtext_1", this.root1).getComponent(cc.RichText).string = `<outline color=#0C2B3C width=2><b>nkey_003</b></outline>??&value1==<size=26><color= #FFF95C>${r1}</c></size>&value2==<size=26><color= #FFF95C>${r2}</c></size>`;
        cc.find("richtext_1", this.root1).getComponent(cc.RichText).string = `<outline color=#0C2B3C width=2><b>nkey_003</b></outline>??&value1==<size=26><color= #FFF95C>${r1}</c></size>&value2==${":"}`;
        cc.find("richtext_2", this.root1).getComponent(cc.Label).string = `${r2}`;
    }

    openRoot2() {
        this.frameData.reportEventCall('n1');

        this.playEffect("YX_TC_01");
        this.root2.active = true;
        this.closeEffect(this.root1);
        this.openEffect(this.root2);
        let FRAME_CONF = this.config.FRAME_CONF;
        cc.find("label_1", this.root2).getComponent(cc.Label).string = `nkey_005??&value1==${20}`//${FRAME_CONF.CoinConf[0].rdm_1}`;
        cc.find("label_2", this.root2).getComponent(cc.Label).string = this.formatNumber(FRAME_CONF.newHand.max);
        cc.find("richtext_1", this.root2).getComponent(cc.RichText).string = `<outline color=#0C2B3C width=2><b>nkey_009</b></outline>??&value1==<size=26><color= #FFF95C>86%</c></size>&value2==<size=26><color= #FFF95C>30</c></size>`;
        let lvTips = cc.find("lvTips", this.root2);
        let lvList = this.getLvData({
            now: 1,
            total: 20//FRAME_CONF.CoinConf[0].rdm_1
        });
        for (let i = 0; i < 6; i++) {
            let value = cc.find(`node${i + 1}`, lvTips);
            value.active = Boolean(lvList[i]);
            if (value.active) {
                cc.find("label_lv", value).getComponent(cc.Label).string = lvList[i];
            }
            if(i == 4){
                value.active = false;
            }
        }
        let _paymentIDs = countryConf.cash_id.slice(0, 4);
        cc.find("paymentRootNode", this.root2).children.forEach((node, index) => node.getComponent(AutoImg).paymentID = _paymentIDs[index] ?? -1);
    }

    getLvData(conf) {
        let lvList = [];
        let s = conf.now < 5 ? 1 : (Math.floor(conf.now / 5) || 1) * 5;
        let code = 5;
        for (let i = s; i < s + code; i++) {
            lvList.push(i);
        }
        let isNow = false;
        for (let i = 0; i < 5; i++) {
            if (lvList[i] == undefined) {
                if (false == isNow) {
                    lvList[i] = conf.now;
                    isNow = true;
                } else {
                    lvList[i] = null;
                }
            } else if (lvList[i] == conf.now) {
                isNow = true;
            }
        }
        lvList.push(conf.total);
        return lvList;
    }

    randomFloat(min: number | number[], max?: number) {
        if (Array.isArray(min)) {
            max = min[1];
            min = min[0];
        }
        return Math.floor((max - min + 1) * Math.random()) + min;
    }

    protected start(): void {
        
    }

    onTouchGo() {
        // this.frameData.logLiftEvent(`game_life_key_node`, { "step": 'guide_end' });
        // this.frameData.sdyEvent(345, "1");
        
        // this.frameData.earlierStageEvent("guide_reward", "guide_button");

        this.frameData.reportEventCall('n3');
        this.frameData.reportEventCall('n4');
        cc.sys.localStorage.setItem("newHand", "1");
       
        let FrameSDK = (<any>cc.js.getClassByName("FrameSDK"));
        FrameSDK?.openWindow("Panel_Award_New2");
        this.closeEffect(this.root2, () => {
            this.frameData.showGameGuide();
            this.node.destroy();
        });
    }

    getFrame() {
        let FrameSDK = (<any>cc.js.getClassByName("FrameSDK"));
        if (FrameSDK && FrameSDK.Panel) {
            this.unschedule(this.getFrame);
            // this.frameData.earlierStageEvent("guide_button", "guide_start");
            this.frameData.reportEventCall('n2');
            cc.js.getClassByName("i18").addi18nArray(langdataArray);
            this.progress.node.parent.active = false;
            this.startButton.active = true;
            this.startButton.scale = 1;
            this.light.active = true;
            cc.Tween.stopAllByTarget(this.startButton);
            cc.tween(this.startButton).to(0.2, {
                scale: 1.1
            }, {
                easing: "sineInOut"
            }).to(0.2, {
                scale: 1
            }, {
                easing: "sineInOut"
            }).union().repeatForever().start();
        }
    }

    playEffect(name: string, isLoop = false, cb?: (audioID: number) => void) {
        cc.assetManager.getBundle("WordNewHand").load("Sound/" + name, cc.AudioClip, (error, assets: cc.AudioClip) => {
            if (assets) {
                let audioID = cc.audioEngine.playEffect(assets, isLoop);
                cb && cb(audioID);
            } else {
                cc.warn("没有这个音效", name);
            }
        });
    }

    openEffect(target: cc.Node) {
        target.scale = 0.1;
        cc.tween(target).to(0.25, {
            scale: 1,
            opacity: 255
        }, {
            easing: "backOut"
        }).start();
    }

    closeEffect(target: any, call?) {
        cc.tween(target).to(0.25, {
            scale: 0.1,
            opacity: 255
        }, {
            easing: "backOut"
        }).hide().call(() => {
            call && call();
        }).start();
    }

    formatNumber(value: number, decimals: number = 0, cashRate: number = 1): string {
        decimals = Math.max(0, Math.floor(decimals));
        if (cashRate > 0) {
            value = value / cashRate * countryConf.rate;
        }
        const str = value.toString();
        const integerAndDecimal = str.split(".");
        if (decimals <= 0) {
            integerAndDecimal.length = 1;
        } else if (integerAndDecimal.length > 1) {
            integerAndDecimal[1] = integerAndDecimal[1].substring(0, decimals);
        }
        const sign = str.startsWith("+") || str.startsWith("-") ? integerAndDecimal[0].substring(0, 1) : "";
        integerAndDecimal[0] = integerAndDecimal[0].substring(sign.length);
        integerAndDecimal[0] = integerAndDecimal[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return `${sign}${cashRate > 0 ? countryConf.symbol : ""}${integerAndDecimal.join(".")}`;
    }
}
let langdataArray = [{
    "key": "nkey_001",
    "zh": "欢迎来到xxx_1,本产品由多家广告平台联合开发",
    "zh_CN": "欢迎来到xxx_1,本产品由多家广告平台联合开发",
    "en": "Welcome to xxx_1. This product is developed in collaboration with multiple advertising platforms.",
    "es": "Bienvenido a xxx_1. Este producto se desarrolló en colaboración con múltiples plataformas publicitarias.",
    "fr": "Bienvenue sur xxx_1. Ce produit est développé en collaboration avec plusieurs plateformes publicitaires.",
    "ja": "xxx_1へようこそ。この製品は複数の広告プラットフォームと共同で開発されています。",
    "de": "Willkommen bei xxx_1. Dieses Produkt wurde in Zusammenarbeit mit mehreren Werbeplattformen entwickelt.",
    "ru": "Добро пожаловать в xxx_1. Этот продукт разработан совместно с несколькими рекламными платформами.",
    "pt": "Bem-vindo ao xxx_1. Este produto foi desenvolvido em colaboração com diversas plataformas de publicidade.",
    "in": "Selamat datang di xxx_1. Produk ini dikembangkan bekerja sama dengan berbagai platform periklanan.",
    "vi": "Chào mừng đến với xxx_1. Sản phẩm này được phát triển với sự hợp tác của nhiều nền tảng quảng cáo.",
    "ar": "مرحبًا بك في xxx_1. تم تطوير هذا المنتج بالتعاون مع منصات إعلانية متعددة.",
    "th": "ยินดีต้อนรับสู่ xxx_1 ผลิตภัณฑ์นี้ได้รับการพัฒนาร่วมกับแพลตฟอร์มโฆษณามากมาย",
    "ko": "xxx_1에 오신 것을 환영합니다. 이 제품은 여러 광고 플랫폼과의 협업을 통해 개발되었습니다.",
    "fil": "Maligayang pagdating sa xxx_1. Ang produktong ito ay binuo sa pakikipagtulungan sa maraming platform ng advertising.",
    "ms": "Selamat datang ke xxx_1. Produk ini dibangunkan dengan kerjasama pelbagai platform pengiklanan.",
    "hi": "xxx_1 में आपका स्वागत है। यह उत्पाद कई विज्ञापन प्लेटफ़ॉर्म के सहयोग से विकसित किया गया है।",
    "tr": "xxx_1'e hoş geldiniz. Bu ürün, birden fazla reklam platformuyla iş birliği yapılarak geliştirilmiştir."
}, 
{"key":"nkey_002","zh":"平台担保","en":"Platform Guarantee","es":"Garantía de la Plataforma","fr":"Garantie de la plateforme","ja":"プラットフォーム保証","de":"Plattform-Garantie","ru":"Гарантия платформы","pt":"Garantia da Plataforma","in":"Jaminan Platform","vi":"Nền tảng bảo đảm","ar":"ضمان المنصة","th":"แพลตฟอร์มรับประกัน","ko":"플랫폼 보증","fil":"Garantiya ng Platform","ms":"Jaminan Platform","hi":"प्लेटफ़ॉर्म गारंटी","tr":"Platform Garantisi"},
{
    "key": "nkey_003",
    "zh": "已有xxx_1人参与游戏\n累计提现xxx_2",
    "zh_CN": "已有xxx_1人参与游戏累计\n累计提现xxx_2",
    "en": "xxx_1 people have joined the game\nA total of xxx_2 withdrawn.",
    "es": "xxx_1 personas se han unido al juego\nUn total de xxx_2 se han retirado.",
    "fr": "xxx_1 personnes ont rejoint le jeu\nUn total de xxx_2 se sont retirées.",
    "ja": "xxx_1 人がゲームに参加しました\n合計 xxx_2 人が退出しました。",
    "de": "xxx_1 Personen sind dem Spiel beigetreten\nInsgesamt haben xxx_2 sich zurückgezogen.",
    "ru": "К игре присоединилось xxx_1 человек. Всего выведено xxx_2 человек.",
    "pt": "xxx_1 pessoas entraram no jogo\nUm total de xxx_2 desistiram.",
    "in": "xxx_1 orang telah bergabung dalam permainan\nSebanyak xxx_2 orang telah mengundurkan diri.",
    "vi": "xxx_1 người đã tham gia trò chơi\nTổng cộng xxx_2 người đã rút lui.",
    "ar": "انضم xxx_1 شخصًا إلى اللعبة\nتم سحب ما مجموعه xxx_2 شخصًا.",
    "th": "xxx_1 คนเข้าร่วมเกม\nทั้งหมด xxx_2 คนถูกถอนออก",
    "ko": "xxx_1명이 게임에 참여했습니다.\n총 xxx_2명이 철회했습니다.",
    "fil": "xxx_1 tao ang sumali sa laro\nKabuuan na xxx_2 ang na-withdraw.",
    "ms": "xxx_1 orang telah menyertai permainan\nSebanyak xxx_2 ditarik balik.",
    "hi": "xxx_1 लोग खेल में शामिल हुए हैं\nकुल xxx_2 लोग वापस लिए गए.",
    "tr": "xxx_1 kişi oyuna katıldı\nToplam xxx_2 kişi oyundan çekildi."
}, {
    "key": "nkey_004",
    "zh": "开始赚钱",
    "zh_CN": "开始赚钱",
    "en": "Start Earning",
    "es": "Empieza a ganar",
    "fr": "Commencez à gagner",
    "ja": "稼ぎ始める",
    "de": "Beginnen Sie zu verdienen",
    "ru": "Начните зарабатывать",
    "pt": "Comece a ganhar",
    "in": "Mulai Menghasilkan",
    "vi": "Bắt đầu kiếm tiền",
    "ar": "ابدأ في الكسب",
    "th": "เริ่มรับรายได้",
    "ko": "수입을 시작하세요",
    "fil": "Simulan ang Kumita",
    "ms": "Mula Mendapat",
    "hi": "कमाई शुरू करें",
    "tr": "Kazanmaya Başlayın"
}, {
    "key": "nkey_005",
    "zh": "成功消除一组即可赚钱，通过第xxx_1关，收集到的所有货币，都可提现",
    "en": "Eliminate one set to earn money. Pass level xxx_1 to withdraw all collected currency.",
    "es": "Elimina un conjunto para ganar dinero. Supera el nivel xxx_1 para retirar toda la moneda recolectada.",
    "fr": "Éliminez un ensemble pour gagner de l'argent. Terminez le niveau xxx_1 pour retirer toute la monnaie collectée.",
    "ja": "1組を消すと収入獲得。レベルxxx_1をクリアすると、集めた全通貨を出金可能。",
    "de": "Entfernen Sie ein Set, um Geld zu verdienen. Bestehen Sie Level xxx_1, um alle gesammelten Währungen abzuheben.",
    "ru": "Устраните одну группу, чтобы заработать. Пройдите уровень xxx_1, чтобы вывести всю собранную валюту.",
    "pt": "Elimine um conjunto para ganhar dinheiro. Passe o nível xxx_1 para sacar toda a moeda coletada.",
    "in": "Hilangkan satu set untuk menghasilkan uang. Lewati level xxx_1 untuk menarik semua mata uang yang terkumpul.",
    "vi": "Loại bỏ một bộ để kiếm tiền. Vượt qua màn xxx_1 để rút toàn bộ tiền tệ đã thu thập.",
    "ar": "أزل مجموعة واحدة لكسب المال. اجتز المستوى xxx_1 لسحب كل العملات التي تم جمعها.",
    "th": "กำจัดหนึ่งชุดเพื่อรับเงิน ผ่านด่าน xxx_1 เพื่อถอนเงินทั้งหมดที่สะสมไว้",
    "ko": "한 세트를 제거하여 수익을 얻으세요. xxx_1 레벨을 통과하여 수집된 모든 통화를 인출하세요.",
    "fil": "Tanggalin ang isang set para kumita ng pera. Pumasa sa level xxx_1 upang i-withdraw lahat ng nakolektang pera.",
    "ms": "Hapuskan satu set untuk menjana wang. Lepasi tahap xxx_1 untuk mengeluarkan semua mata wang yang dikumpul.",
    "hi": "एक सेट हटाकर पैसे कमाएँ। सभी एकत्रित मुद्रा निकालने के लिए स्तर xxx_1 पास करें।",
    "tr": "Bir seti ortadan kaldırarak para kazanın. Toplanan tüm paranın çekilmesi için xxx_1 seviyesini geçin."
},
 {
    "key": "nkey_006",
    "zh": "提现",
    "zh_CN": "提现",
    "en": "Withdrawal",
    "es": "Retiro",
    "fr": "Retrait",
    "ja": "引き出し",
    "de": "Rückzug",
    "ru": "Снятие",
    "pt": "Cancelamento",
    "in": "Penarikan",
    "vi": "Rút tiền",
    "ar": "انسحاب",
    "th": "การถอนเงิน",
    "ko": "철수",
    "fil": "Pag-withdraw",
    "ms": "Pengeluaran",
    "hi": "निकासी",
    "tr": "Para çekme"
}, {
    "key": "nkey_007",
    "zh": "至少",
    "zh_CN": "至少",
    "en": "Minimum Get",
    "es": "Mínimo Obtener",
    "fr": "Minimum Get",
    "ja": "最小取得",
    "de": "Mindestabruf",
    "ru": "Минимальная сумма",
    "pt": "Obtenção mínima",
    "in": "Minimal Mendapatkan",
    "vi": "Tối thiểu Nhận được",
    "ar": "الحد الأدنى للحصول",
    "th": "รับขั้นต่ำ",
    "ko": "최소 획득",
    "fil": "Minimum Get",
    "ms": "Dapatkan Minimum",
    "hi": "न्यूनतम प्राप्ति",
    "tr": "Minimum Kazanç"
}, {
    "key": "nkey_008",
    "zh": "开始挑战",
    "zh_CN": "开始挑战",
    "en": "Start Challenge",
    "es": "Iniciar desafío",
    "fr": "Démarrer le défi",
    "ja": "チャレンジを始める",
    "de": "Herausforderung starten",
    "ru": "Начать вызов",
    "pt": "Iniciar desafio",
    "in": "Mulai Tantangan",
    "vi": "Bắt đầu thử thách",
    "ar": "ابدأ التحدي",
    "th": "เริ่มความท้าทาย",
    "ko": "챌린지 시작",
    "fil": "Simulan ang Hamon",
    "ms": "Mulakan Cabaran",
    "hi": "चुनौती शुरू करें",
    "tr": "Meydan Okumaya Başla"
}, {
    "key": "nkey_009",
    "zh": "xxx_1用户可在xxx_2分钟内完成挑战",
    "zh_CN": "xxx_1用户可在xxx_2分钟内完成挑战",
    "en": "xxx_1 users can complete the challenge in xxx_2 minutes.",
    "es": "Los usuarios de xxx_1 pueden completar el desafío en xxx_2 minutos.",
    "fr": "Les utilisateurs xxx_1 peuvent relever le défi en xxx_2 minutes.",
    "ja": "xxx_1 人のユーザーが xxx_2 分でチャレンジを完了できます。",
    "de": "xxx_1 Benutzer können die Herausforderung in xxx_2 Minuten abschließen.",
    "ru": "xxx_1 пользователей могут выполнить задание за xxx_2 минуты.",
    "pt": "Usuários xxx_1 podem completar o desafio em xxx_2 minutos.",
    "in": "Pengguna xxx_1 dapat menyelesaikan tantangan dalam xxx_2 menit.",
    "vi": "xxx_1 người dùng có thể hoàn thành thử thách trong xxx_2 phút.",
    "ar": "يمكن لمستخدمي xxx_1 إكمال التحدي في xxx_2 دقيقة.",
    "th": "ผู้ใช้ xxx_1 คนสามารถทำภารกิจนี้ให้สำเร็จได้ภายใน xxx_2 นาที",
    "ko": "xxx_1명의 사용자가 xxx_2분 안에 챌린지를 완료할 수 있습니다.",
    "fil": "Makukumpleto ng xxx_1 user ang hamon sa loob ng xxx_2 minuto.",
    "ms": "xxx_1 pengguna boleh menyelesaikan cabaran dalam xxx_2 minit.",
    "hi": "xxx_1 उपयोगकर्ता xxx_2 मिनट में चुनौती पूरी कर सकते हैं।",
    "tr": "xxx_1 kullanıcıları mücadeleyi xxx_2 dakikada tamamlayabilir."
},
{"key":"nkey_010","zh":"赚钱有保障","en":"Guaranteed Earnings","es":"Ganancias Garantizadas","fr":"Gains garantis","ja":"収益保証","de":"Garantierte Einnahmen","ru":"Гарантированный заработок","pt":"Ganhos Garantidos","in":"Penghasilan Terjamin","vi":"Kiếm tiền có bảo đảm","ar":"أرباح مضمونة","th":"รับประกันรายได้","ko":"수익 보장","fil":"Garantisadong Kita","ms":"Pendapatan Terjamin","hi":"गारंटीकृत कमाई","tr":"Garantili Kazanç"}
];
let COUNTRY_LIST = [{
    "id": 101,
    "name": "美国",
    "country": "US",
    "language": "en",
    "rate": 1,
    "symbol": "$",
    "ad_t": 1,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 102,
    "name": "英国",
    "country": "GB",
    "language": "en",
    "rate": 1,
    "symbol": "￡",
    "ad_t": 1,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 103,
    "name": "法国",
    "country": "FR",
    "language": "fr",
    "rate": 1,
    "symbol": "€",
    "ad_t": 1,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 104,
    "name": "德国",
    "country": "DE",
    "language": "de",
    "rate": 1,
    "symbol": "€",
    "ad_t": 1,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 105,
    "name": "日本",
    "country": "JP",
    "language": "ja",
    "rate": 100,
    "symbol": "円",
    "ad_t": 1,
    "cash_id": [122, 126, 101, 103]
}, {
    "id": 106,
    "name": "加拿大",
    "country": "CA",
    "language": "en",
    "rate": 1,
    "symbol": "$",
    "ad_t": 1,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 107,
    "name": "澳大利亚",
    "country": "AU",
    "language": "en",
    "rate": 1,
    "symbol": "$",
    "ad_t": 1,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 108,
    "name": "新西兰",
    "country": "NZ",
    "language": "en",
    "rate": 1,
    "symbol": "$",
    "ad_t": 1,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 109,
    "name": "挪威",
    "country": "NO",
    "language": "no",
    "rate": 10,
    "symbol": "NOK",
    "ad_t": 1,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 110,
    "name": "新加坡",
    "country": "SG",
    "language": "en",
    "rate": 1,
    "symbol": "$",
    "ad_t": 1,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 111,
    "name": "瑞典",
    "country": "SE",
    "language": "se",
    "rate": 10,
    "symbol": "SEK",
    "ad_t": 1,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 112,
    "name": "瑞士",
    "country": "CH",
    "language": "de",
    "rate": 1,
    "symbol": "CHF",
    "ad_t": 1,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 201,
    "name": "西班牙",
    "country": "ES",
    "language": "es",
    "rate": 1,
    "symbol": "€",
    "ad_t": 2,
    "cash_id": [113, 111, 101, 103]
}, {
    "id": 202,
    "name": "阿拉伯",
    "country": "SA",
    "language": "ar",
    "rate": 5,
    "symbol": "SR",
    "ad_t": 2,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 203,
    "name": "波兰",
    "country": "PL",
    "language": "pl",
    "rate": 5,
    "symbol": "złote",
    "ad_t": 2,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 204,
    "name": "韩国",
    "country": "KR",
    "language": "ko",
    "rate": 1000,
    "symbol": "₩",
    "ad_t": 2,
    "cash_id": [130, 101, 103, 102]
}, {
    "id": 205,
    "name": "意大利",
    "country": "IT",
    "language": "it",
    "rate": 1,
    "symbol": "€",
    "ad_t": 2,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 206,
    "name": "比利时",
    "country": "BE",
    "language": "nl",
    "rate": 1,
    "symbol": "€",
    "ad_t": 2,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 207,
    "name": "荷兰",
    "country": "NL",
    "language": "nl",
    "rate": 1,
    "symbol": "€",
    "ad_t": 2,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 301,
    "name": "印度",
    "country": "IN",
    "language": "hi",
    "rate": 80,
    "symbol": "₹",
    "ad_t": 3,
    "cash_id": [124, 125, 101, 103]
}, {
    "id": 302,
    "name": "印尼",
    "country": "ID",
    "language": "in",
    "rate": 15000,
    "symbol": "Rp",
    "ad_t": 3,
    "cash_id": [105, 106, 101, 103]
}, {
    "id": 303,
    "name": "葡萄牙",
    "country": "PT",
    "language": "pt",
    "rate": 1,
    "symbol": "€",
    "ad_t": 3,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 304,
    "name": "泰国",
    "country": "TH",
    "language": "th",
    "rate": 30,
    "symbol": "฿",
    "ad_t": 3,
    "cash_id": [112, 118, 101, 103]
}, {
    "id": 305,
    "name": "菲律宾",
    "country": "PH",
    "language": "fil",
    "rate": 50,
    "symbol": "₱",
    "ad_t": 3,
    "cash_id": [121, 116, 101, 103]
}, {
    "id": 306,
    "name": "马来西亚",
    "country": "MY",
    "language": "ms",
    "rate": 5,
    "symbol": "RM",
    "ad_t": 3,
    "cash_id": [119, 121, 101, 103]
}, {
    "id": 307,
    "name": "哥伦比亚",
    "country": "CO",
    "language": "es",
    "rate": 3000,
    "symbol": "COP",
    "ad_t": 3,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 308,
    "name": "阿根廷",
    "country": "AR",
    "language": "es",
    "rate": 350,
    "symbol": "ARS",
    "ad_t": 3,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 309,
    "name": "墨西哥",
    "country": "MX",
    "language": "es",
    "rate": 20,
    "symbol": "Mex.$",
    "ad_t": 3,
    "cash_id": [113, 111, 101, 103]
}, {
    "id": 310,
    "name": "巴西",
    "country": "BR",
    "language": "pt",
    "rate": 5,
    "symbol": "R$",
    "ad_t": 3,
    "cash_id": [107, 113, 123, 101]
}, {
    "id": 311,
    "name": "越南",
    "country": "VN",
    "language": "vi",
    "rate": 20000,
    "symbol": "₫",
    "ad_t": 3,
    "cash_id": [120, 115, 101, 103]
}, {
    "id": 312,
    "name": "土耳其",
    "country": "TR",
    "language": "tr",
    "rate": 8,
    "symbol": "₺",
    "ad_t": 3,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 313,
    "name": "罗马尼亚",
    "country": "RO",
    "language": "ro",
    "rate": 5,
    "symbol": "Lei",
    "ad_t": 3,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 314,
    "name": "约旦",
    "country": "JO",
    "language": "ar",
    "rate": 1,
    "symbol": "$",
    "ad_t": 3,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 315,
    "name": "伊拉克",
    "country": "IQ",
    "language": "ar",
    "rate": 1,
    "symbol": "$",
    "ad_t": 3,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 316,
    "name": "埃及",
    "country": "EG",
    "language": "ar",
    "rate": 1,
    "symbol": "$",
    "ad_t": 3,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 317,
    "name": "以色列",
    "country": "IL",
    "language": "ar",
    "rate": 1,
    "symbol": "$",
    "ad_t": 3,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 318,
    "name": "俄罗斯",
    "country": "RU",
    "language": "ru",
    "rate": 70,
    "symbol": "₽",
    "ad_t": 3,
    "cash_id": [114, 117, 101, 103]
}, {
    "id": 319,
    "name": "乌克兰",
    "country": "UA",
    "language": "uk",
    "rate": 20,
    "symbol": "₴",
    "ad_t": 3,
    "cash_id": [101, 103, 102, 104]
}, {
    "id": 400,
    "name": "SBALL",
    "country": "SBALL",
    "language": "en",
    "rate": 1,
    "symbol": "$",
    "ad_t": 3,
    "cash_id": [101, 103, 102, 104]
}];
let countryConf = COUNTRY_LIST[0];
if (!CC_EDITOR) {
    let getlang = function (langcode) {
        let index = langcode.indexOf("#");
        langcode = langcode.substring(0, index == -1 ? langcode.length : index);
        let langarr = langcode.split(langcode.indexOf("_") != -1 ? "_" : "-");
        for (let i = langarr.length - 1; i >= 0; i--) {
            if (langarr[i] == "") {
                langarr.splice(i, 1);
            }
        }
        let data = {
            lang: langarr[0],
            country: "SBALL"
        };
        if (langarr.length > 1) {
            data = {
                lang: langarr[0],
                country: langarr[langarr.length - 1]
            };
        }
        let CountryList = COUNTRY_LIST;
        for (let country of CountryList) {
            if (data.country.toLowerCase() == country.country.toLowerCase()) {
                return country;
            }
        }
        data = {
            lang: "en",
            country: "SBALL"
        };
        for (let country of CountryList) {
            if (data.country.toLowerCase() == country.country.toLowerCase()) {
                return country;
            }
        }
        return CountryList[0];
    };
    countryConf = getlang(cc.sys.languageCode);
    let myLanguge = countryConf.language;
    let langArray = {};
    for (let lnode of langdataArray) {
        let index = lnode.key.lastIndexOf("_") + 1;
        let pkey = lnode.key.substring(0, index);
        let num = parseInt(lnode.key.substring(index, lnode.key.length));
        if (langArray[pkey] == undefined) {
            langArray[pkey] = {};
        }
        langArray[pkey][num] = lnode[myLanguge];
    }
    let parseURL = function (url) {
        //解析GET请求url上?后的请求参数，将请求参数从url上取下来，放到{}中
        let result = {},
            seg = url.split("&"),
            len = seg.length,
            i = 0,
            s;
        for (; i < len; i++) {
            if (!seg[i]) {
                continue;
            }
            s = seg[i].split("==");
            s[1] = s[1].replace(/%/g, "%25");
            result[s[0]] = decodeURIComponent(s[1]);
        }
        return result;
    };
    let getLanByKey = function (skey: string) {
        for (let key in langArray) {
            let index = skey.indexOf(key);
            if (index != -1) {
                let num = skey.substring(index + key.length, index + key.length + 3);
                let code = parseInt(num);
                if (langArray[key] && langArray[key][code]) {
                    let result = skey.replace(key + num, langArray[key][code]);
                    let pindex = result.indexOf("??&");
                    if (pindex != -1) {
                        let before = result.substring(0, pindex);
                        let after = result.substring(pindex + 2, result.length);
                        let data = parseURL(after);
                        let xxarr = before.match(/xxx_\d/g);
                        if (xxarr) for (let i = 0; i < xxarr.length; i++) {
                            before = before.replace(xxarr[i], data["value" + xxarr[i].substring(4, 5)]);
                        }
                        return before;
                    }
                    return result;
                }
                return skey;
            }
        }
        return skey;
    };
    let label = Object.getOwnPropertyDescriptor(cc.Label.prototype, "string");
    Object.defineProperty(cc.Label.prototype, "string", {
        set(value) {
            label.set.call(this, getLanByKey(value.toString()));
        },
        get() {
            this._string = getLanByKey(this._string);
            return label.get.call(this);
        }
    });
    let richText = Object.getOwnPropertyDescriptor(cc.RichText.prototype, "string");
    Object.defineProperty(cc.RichText.prototype, "string", {
        set(value) {
            richText.set.call(this, getLanByKey(value.toString()));
        },
        get() {
            this._N$string = getLanByKey(this._N$string);
            return richText.get.call(this);
        }
    });
}