const {ccclass, property} = cc._decorator;

@ccclass
export default class Item_Record extends cc.Component {
    @property(cc.RichText)
    rich: cc.RichText = null;


    setData(msg) {
        let tcolor = "<color=#F18321>";
        if (msg.key == "tkey_209") {
            tcolor = "<color=#F18321>";
            this.rich.string = `${msg.key}??&value1==<color =#4480BE>${msg.peopleCount}</color>`;
        } else if (msg.key == "tkey_210") {
            tcolor = "<color=#C23E3E>";
            this.rich.string = `${msg.key}??&value1==<color =#4480BE>${msg.account}</color>&&value2==<color =#4480BE>${msg.peopleCount}</color>`;
        } else if (msg.key == "tkey_211") {
            tcolor = "<color=#249A50>";
            this.rich.string = `${msg.key}??&value1==<color =#4480BE>${msg.account}</color>&&value2==<color =#4480BE>${msg.peopleCount}</color>`;
        }
        let index = this.rich.string.indexOf(":");
        if (index == -1) {
            index = this.rich.string.indexOf(":");
        }
        if (index != -1) {
            this.rich.string = tcolor + this.rich.string.substring(0, index + 1) + "</color>" + this.rich.string.substring(index + 1, this.rich.string.length);
        } else {
            this.rich.string = "" + this.rich.string;
        }
    }

}