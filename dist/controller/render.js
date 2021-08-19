"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pug_1 = __importDefault(require("pug"));
class render {
    static pug(dir, options = {}) {
        return pug_1.default.renderFile(dir, options);
    }
}
exports.default = render;
//# sourceMappingURL=render.js.map