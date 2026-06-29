// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { A } from "./centerio/api";
import AudioManager from "./framework/controller/AudioManager";
import EventMgr from "./framework/Event/EventMgr";
import GameEventType from "./framework/Event/GameEventType";
import { trackCreatorEvent } from "./common/GameTrackUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HallPageViewNode extends cc.Component {

    // @property(cc.PageView)
    // pageView: cc.PageView = null;

    @property(cc.Node)
    nextBtn: cc.Node = null;

    @property(cc.Node)
    wordNode1: cc.Node = null;
    @property(cc.Node)
    wordNode2: cc.Node = null;

    @property(cc.Node)
    starNode: cc.Node = null;

    @property(cc.Label)
    wordTips1: cc.Label = null;
    @property(cc.Label)
    wordTips2: cc.Label = null;

    @property(cc.Sprite)
    wordBg1: cc.Sprite = null;

    @property([cc.SpriteFrame])
    frameList: cc.SpriteFrame[] = []; 
    
    @property([cc.Node])
    pointNodes: cc.Node[] = [];    


    private curPageIndex = 0;

    private wordConfig = [
        {
            indexe: 0,
            wordText: "gkey_801",
            pos: cc.v2(0, 346),
        },
        {
            indexe: 1,
            wordText: "gkey_802",
            pos: cc.v2(0, 442),
        },
        {
            indexe: 2,
            wordText: "gkey_803",
            pos: cc.v2(0, 346),
        },
        {
            indexe: 3,
            wordText: "gkey_804",
            pos: cc.v2(0, 453),
        },
        {
            indexe: 4,
            wordText: "gkey_805",
            pos: cc.v2(0, 464),
        },
        {
            indexe: 5,
            wordText: "gkey_806",
            pos: cc.v2(0, 248),
        }
    ]

    private isAniming = false;

    start () {
        // this.onScrollEvent();
        this.changeUI(this.curPageIndex);
        this.isAniming = true;
        trackCreatorEvent(470, this.curPageIndex + 1);
        this.showNextBtn();

    }

    onClickNext() {

        if(this.isAniming) {
            return;
        }
        this.isAniming = true;
        trackCreatorEvent(470, this.curPageIndex + 2);

        // A.w3(()=>{
            AudioManager.getInstance().playEffect("click");
        // });
        
        this.curPageIndex++;
        
        this.changeUI(this.curPageIndex);

        this.nextBtn.active = false;
        if(this.curPageIndex < this.wordConfig.length - 1) {
            this.showNextBtn();
        }
       
    }

    showNextBtn() {
        this.nextBtn.active = true;
        this.nextBtn.opacity = 0
        this.scheduleOnce(() => {
            cc.tween(this.nextBtn)
            .to(0.8, { opacity: 255 })
            .call(() => {
                this.isAniming = false;
            })
            .start();   
            this.nextBtn.active = true;
        }, 0.5);
    }

    changeUI(index: number) {
        if(index < 0 || index >= this.wordConfig.length) {
            return;
        }
        let wordConfig = this.wordConfig[this.curPageIndex];

        this.nextBtn.active = this.curPageIndex < this.wordConfig.length - 1;

        this.wordBg1.spriteFrame = this.frameList[index];
        this.wordTips1.string = wordConfig.wordText;
        this.wordTips2.string = wordConfig.wordText;

        this.wordNode1.setPosition(wordConfig.pos);
        this.wordNode2.setPosition(wordConfig.pos);

        this.wordNode1.active = index < this.wordConfig.length - 1;
        this.wordNode2.active = index >= this.wordConfig.length - 1;
        this.starNode.active = index == this.wordConfig.length - 1;

        for (let index = 0; index < this.pointNodes.length; index++) {
            this.pointNodes[index].active = false;
        }

        this.pointNodes[this.curPageIndex].active = true;
    }


    onClickStart() {
        // A.w3(()=>{
            AudioManager.getInstance().playEffect("click");
        // });
        this.node.active = false;
        EventMgr.trigger(GameEventType.PAGE_SHOW, {
            name: "MainNodePage"
        });
    }

    onClickClose() {
        cc.director.loadScene("Hall");
    }
}
