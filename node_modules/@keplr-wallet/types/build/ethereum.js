"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthTxStatus = exports.EthSignType = void 0;
var EthSignType;
(function (EthSignType) {
    EthSignType["MESSAGE"] = "message";
    EthSignType["TRANSACTION"] = "transaction";
    EthSignType["EIP712"] = "eip-712";
})(EthSignType = exports.EthSignType || (exports.EthSignType = {}));
var EthTxStatus;
(function (EthTxStatus) {
    EthTxStatus["Success"] = "0x1";
    EthTxStatus["Failure"] = "0x0";
})(EthTxStatus = exports.EthTxStatus || (exports.EthTxStatus = {}));
//# sourceMappingURL=ethereum.js.map