import GlobaldataMgr from '../framework/data/GlobaldataMgr';
export default class FormData {
  _boundary_key = "AaB03x";
  _boundary = "";
  _end_boundary = "";
  _result = "";
  _formResult = "";
  constructor() {
    this._boundary = "--" + this._boundary_key;
    this._end_boundary = this._boundary + "--";
    this._result = "";
  }
  append(e, t) {
    this._result += this._boundary + "\r\n";
    this._result += 'Content-Disposition: form-data; name="' + e + '"\r\n\r\n';
    this._result += t + "\r\n";
  }
  arrayBuffer() {
    this._formResult = this._result + this._end_boundary;
    var e = [];
    GlobaldataMgr.is_encrypt || (this._formResult = this.ch2Unicdoe(this._formResult));
    for (var t = 0; t < this._formResult.length; t++) e.push(this._formResult.charCodeAt(t));
    return new Uint8Array(e).buffer;
  }
  arrayBuffer_confme() {
    this._formResult = this._result + this._end_boundary;
    return this._formResult;
  }
  ch2Unicdoe(e) {
    if (!e) return "";
    for (var t = "", o = new RegExp(`gkey_292`), n = 0; n < e.length; n++) {
      var a = e.charAt(n);
      if (o.test(a)) {
        t += '\%u' + a.charCodeAt(0).toString(16);
      } else {
        t += a;
      }
    }
    return t;
  }
}