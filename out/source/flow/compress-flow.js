"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const compress = require("../util/compress");
const Log = require("../util/log");
function excute(compressPath, outPutPath) {
    return __awaiter(this, void 0, void 0, function* () {
        Log.log("开始执行文件压缩");
        try {
            yield compress.exe(compressPath, outPutPath);
            Log.log("压缩成功,文件路径" + outPutPath);
        }
        catch (e) {
            Log.log("压缩失败" + e);
        }
    });
}
module.exports = {
    excute
};
//# sourceMappingURL=compress-flow.js.map