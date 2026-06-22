// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import AudioManager from "./framework/controller/AudioManager";
import EventMgr from "./framework/Event/EventMgr";
import GameEventType from "./framework/Event/GameEventType";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HallPageViewNode extends cc.Component {

    @property(cc.PageView)
    pageView: cc.PageView = null;

    @property(cc.Node)
    nextBtn: cc.Node = null;
    @property(cc.Node)
    prevBtn: cc.Node = null;


    private curPageIndex = 0;

    start () {
        this.onScrollEvent();
    }

    onClickNext() {
        AudioManager.getInstance().playMusic("click");
        let nextPageIndex = this.curPageIndex + 1;
        if(nextPageIndex >= this.pageView.getPages().length) {
            this.curPageIndex = this.pageView.getPages().length - 1 ;
            return;
        }
        this.curPageIndex++;
        this.pageView.scrollToPage(nextPageIndex, 0.3);
        this.scheduleOnce(()=>{
            this.prevBtn.active = true;
            if(this.curPageIndex === this.pageView.getPages().length - 1) {
                this.nextBtn.active = false;
            }
        },0.3)
    }

    onClickPrev() {
        AudioManager.getInstance().playMusic("click");
        let prevPageIndex = this.curPageIndex - 1;
        if(prevPageIndex < 0) {
            this.curPageIndex = 0
            return;
        }
        this.curPageIndex--;
        this.pageView.scrollToPage(prevPageIndex, 0.3);
        this.scheduleOnce(()=>{
            this.nextBtn.active = true;
            if(this.curPageIndex === 0) {
                this.prevBtn.active = false;
            }
        },0.3)
        
    }

    onScrollEvent() {
       console.log("onScrollEvent",this.curPageIndex,this.pageView.getCurrentPageIndex());
       this.curPageIndex = this.pageView.getCurrentPageIndex();
       this.nextBtn.active = this.curPageIndex < this.pageView.getPages().length - 1;
       this.prevBtn.active = this.curPageIndex > 0;
       let childs = this.pageView.indicator.node.children;
       if(childs && childs.length > 0) {
        for(let i = 0; i < childs.length; i++) {
            if(childs[i]) {
                childs[i].opacity = 255;
                childs[i].color = this.curPageIndex === i ? cc.Color.WHITE : cc.Color.BLACK;
            }
        }
       }
    }
       

    onClickStart() {
        AudioManager.getInstance().playMusic("click");
        this.node.active = false;
        EventMgr.trigger(GameEventType.PAGE_SHOW, {
            name: "MainNodePage"
        });
    }

    onClickClose() {
        cc.director.loadScene("Hall");
    }
}
