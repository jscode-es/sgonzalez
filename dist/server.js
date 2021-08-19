"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("./directories");
const error_1 = __importDefault(require("./controller/error"));
const server_1 = __importDefault(require("./controller/server"));
error_1.default.listener();
new server_1.default(server_1.default.HTTP);
//# sourceMappingURL=server.js.map