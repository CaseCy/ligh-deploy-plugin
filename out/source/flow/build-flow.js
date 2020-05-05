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
const projectBuild = require("../util/projectBuild");
const Log = require("../util/log");
function excute(buildConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        Log.log("开始进行项目构建，构建路径：" + buildConfig.path + " 执行的命令：" + buildConfig.cmd);
        const { err, stdout, } = yield projectBuild.build(buildConfig);
        if (err) {
            throw err;
        }
        Log.log("构建结果：" + stdout);
        Log.log("构建结束");
    });
}
module.exports = {
    excute
};
//# sourceMappingURL=build-flow.js.map