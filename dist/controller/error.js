"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class error {
    static listener() {
        process.on('unhandledRejection', error._unhandledRejection);
        process.on('uncaughtException', error._uncaughtException);
    }
    static _unhandledRejection(reason, promise) {
        console.log('[ unhandledRejection ]', promise, 'reason:', reason);
    }
    static _uncaughtException(error) {
        console.log('[ uncaughtException ]', error);
    }
}
exports.default = error;
//# sourceMappingURL=error.js.map