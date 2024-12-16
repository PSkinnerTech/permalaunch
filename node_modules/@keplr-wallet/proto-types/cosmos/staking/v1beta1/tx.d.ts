import _m0 from "protobufjs/minimal";
import { Description, CommissionRates } from "../../../cosmos/staking/v1beta1/staking";
import { Any } from "../../../google/protobuf/any";
import { Coin } from "../../../cosmos/base/v1beta1/coin";
export declare const protobufPackage = "cosmos.staking.v1beta1";
/** MsgCreateValidator defines a SDK message for creating a new validator. */
export interface MsgCreateValidator {
    description: Description | undefined;
    commission: CommissionRates | undefined;
    /**
     * Deprecated: This field has been deprecated with LSM in favor of the validator bond
     *
     * @deprecated
     */
    minSelfDelegation: string;
    delegatorAddress: string;
    validatorAddress: string;
    pubkey: Any | undefined;
    value: Coin | undefined;
}
/** MsgCreateValidatorResponse defines the Msg/CreateValidator response type. */
export interface MsgCreateValidatorResponse {
}
/** MsgEditValidator defines a SDK message for editing an existing validator. */
export interface MsgEditValidator {
    description: Description | undefined;
    validatorAddress: string;
    /**
     * We pass a reference to the new commission rate and min self delegation as
     * it's not mandatory to update. If not updated, the deserialized rate will be
     * zero with no way to distinguish if an update was intended.
     * REF: #2373
     */
    commissionRate: string;
    /** @deprecated */
    minSelfDelegation: string;
}
/** MsgEditValidatorResponse defines the Msg/EditValidator response type. */
export interface MsgEditValidatorResponse {
}
/**
 * MsgDelegate defines a SDK message for performing a delegation of coins
 * from a delegator to a validator.
 */
export interface MsgDelegate {
    delegatorAddress: string;
    validatorAddress: string;
    amount: Coin | undefined;
}
/** MsgDelegateResponse defines the Msg/Delegate response type. */
export interface MsgDelegateResponse {
}
/**
 * MsgBeginRedelegate defines a SDK message for performing a redelegation
 * of coins from a delegator and source validator to a destination validator.
 */
export interface MsgBeginRedelegate {
    delegatorAddress: string;
    validatorSrcAddress: string;
    validatorDstAddress: string;
    amount: Coin | undefined;
}
/** MsgBeginRedelegateResponse defines the Msg/BeginRedelegate response type. */
export interface MsgBeginRedelegateResponse {
    completionTime: Date | undefined;
}
/**
 * MsgUndelegate defines a SDK message for performing an undelegation from a
 * delegate and a validator.
 */
export interface MsgUndelegate {
    delegatorAddress: string;
    validatorAddress: string;
    amount: Coin | undefined;
}
/** MsgUndelegateResponse defines the Msg/Undelegate response type. */
export interface MsgUndelegateResponse {
    completionTime: Date | undefined;
}
/**
 * MsgUnbondValidator defines a method for performing the status transition for
 * a validator from bonded to unbonded
 */
export interface MsgUnbondValidator {
    validatorAddress: string;
}
/** MsgUnbondValidatorResponse defines the Msg/UnbondValidator response type. */
export interface MsgUnbondValidatorResponse {
}
/**
 * MsgCancelUnbondingDelegation defines the SDK message for performing a cancel unbonding delegation for delegator
 *
 * Since: cosmos-sdk 0.46
 */
export interface MsgCancelUnbondingDelegation {
    delegatorAddress: string;
    validatorAddress: string;
    /** amount is always less than or equal to unbonding delegation entry balance */
    amount: Coin | undefined;
    /** creation_height is the height which the unbonding took place. */
    creationHeight: string;
}
/**
 * MsgCancelUnbondingDelegationResponse
 *
 * Since: cosmos-sdk 0.46
 */
export interface MsgCancelUnbondingDelegationResponse {
}
/** MsgTokenizeShares tokenizes a delegation */
export interface MsgTokenizeShares {
    delegatorAddress: string;
    validatorAddress: string;
    amount: Coin | undefined;
    tokenizedShareOwner: string;
}
/** MsgTokenizeSharesResponse defines the Msg/MsgTokenizeShares response type. */
export interface MsgTokenizeSharesResponse {
    amount: Coin | undefined;
}
/** MsgRedeemTokensForShares redeems a tokenized share back into a native delegation */
export interface MsgRedeemTokensForShares {
    delegatorAddress: string;
    amount: Coin | undefined;
}
/** MsgRedeemTokensForSharesResponse defines the Msg/MsgRedeemTokensForShares response type. */
export interface MsgRedeemTokensForSharesResponse {
    amount: Coin | undefined;
}
/** MsgTransferTokenizeShareRecord transfer a tokenize share record */
export interface MsgTransferTokenizeShareRecord {
    tokenizeShareRecordId: string;
    sender: string;
    newOwner: string;
}
/** MsgTransferTokenizeShareRecordResponse defines the Msg/MsgTransferTokenizeShareRecord response type. */
export interface MsgTransferTokenizeShareRecordResponse {
}
/** MsgDisableTokenizeShares prevents the tokenization of shares for a given address */
export interface MsgDisableTokenizeShares {
    delegatorAddress: string;
}
/** MsgDisableTokenizeSharesResponse defines the Msg/DisableTokenizeShares response type. */
export interface MsgDisableTokenizeSharesResponse {
}
/** MsgEnableTokenizeShares re-enables tokenization of shares for a given address */
export interface MsgEnableTokenizeShares {
    delegatorAddress: string;
}
/** MsgEnableTokenizeSharesResponse defines the Msg/EnableTokenizeShares response type. */
export interface MsgEnableTokenizeSharesResponse {
    completionTime: Date | undefined;
}
/**
 * MsgValidatorBond defines a SDK message for performing validator self-bond of delegated coins
 * from a delegator to a validator.
 */
export interface MsgValidatorBond {
    delegatorAddress: string;
    validatorAddress: string;
}
/** MsgValidatorBondResponse defines the Msg/ValidatorBond response type. */
export interface MsgValidatorBondResponse {
}
export declare const MsgCreateValidator: {
    encode(message: MsgCreateValidator, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateValidator;
    fromJSON(object: any): MsgCreateValidator;
    toJSON(message: MsgCreateValidator): unknown;
    fromPartial<I extends {
        description?: {
            moniker?: string | undefined;
            identity?: string | undefined;
            website?: string | undefined;
            securityContact?: string | undefined;
            details?: string | undefined;
        } | undefined;
        commission?: {
            rate?: string | undefined;
            maxRate?: string | undefined;
            maxChangeRate?: string | undefined;
        } | undefined;
        minSelfDelegation?: string | undefined;
        delegatorAddress?: string | undefined;
        validatorAddress?: string | undefined;
        pubkey?: {
            typeUrl?: string | undefined;
            value?: Uint8Array | undefined;
        } | undefined;
        value?: {
            denom?: string | undefined;
            amount?: string | undefined;
        } | undefined;
    } & {
        description?: ({
            moniker?: string | undefined;
            identity?: string | undefined;
            website?: string | undefined;
            securityContact?: string | undefined;
            details?: string | undefined;
        } & {
            moniker?: string | undefined;
            identity?: string | undefined;
            website?: string | undefined;
            securityContact?: string | undefined;
            details?: string | undefined;
        } & Record<Exclude<keyof I["description"], keyof Description>, never>) | undefined;
        commission?: ({
            rate?: string | undefined;
            maxRate?: string | undefined;
            maxChangeRate?: string | undefined;
        } & {
            rate?: string | undefined;
            maxRate?: string | undefined;
            maxChangeRate?: string | undefined;
        } & Record<Exclude<keyof I["commission"], keyof CommissionRates>, never>) | undefined;
        minSelfDelegation?: string | undefined;
        delegatorAddress?: string | undefined;
        validatorAddress?: string | undefined;
        pubkey?: ({
            typeUrl?: string | undefined;
            value?: Uint8Array | undefined;
        } & {
            typeUrl?: string | undefined;
            value?: Uint8Array | undefined;
        } & Record<Exclude<keyof I["pubkey"], keyof Any>, never>) | undefined;
        value?: ({
            denom?: string | undefined;
            amount?: string | undefined;
        } & {
            denom?: string | undefined;
            amount?: string | undefined;
        } & Record<Exclude<keyof I["value"], keyof Coin>, never>) | undefined;
    } & Record<Exclude<keyof I, keyof MsgCreateValidator>, never>>(object: I): MsgCreateValidator;
};
export declare const MsgCreateValidatorResponse: {
    encode(_: MsgCreateValidatorResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateValidatorResponse;
    fromJSON(_: any): MsgCreateValidatorResponse;
    toJSON(_: MsgCreateValidatorResponse): unknown;
    fromPartial<I extends {} & {} & Record<Exclude<keyof I, never>, never>>(_: I): MsgCreateValidatorResponse;
};
export declare const MsgEditValidator: {
    encode(message: MsgEditValidator, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgEditValidator;
    fromJSON(object: any): MsgEditValidator;
    toJSON(message: MsgEditValidator): unknown;
    fromPartial<I extends {
        description?: {
            moniker?: string | undefined;
            identity?: string | undefined;
            website?: string | undefined;
            securityContact?: string | undefined;
            details?: string | undefined;
        } | undefined;
        validatorAddress?: string | undefined;
        commissionRate?: string | undefined;
        minSelfDelegation?: string | undefined;
    } & {
        description?: ({
            moniker?: string | undefined;
            identity?: string | undefined;
            website?: string | undefined;
            securityContact?: string | undefined;
            details?: string | undefined;
        } & {
            moniker?: string | undefined;
            identity?: string | undefined;
            website?: string | undefined;
            securityContact?: string | undefined;
            details?: string | undefined;
        } & Record<Exclude<keyof I["description"], keyof Description>, never>) | undefined;
        validatorAddress?: string | undefined;
        commissionRate?: string | undefined;
        minSelfDelegation?: string | undefined;
    } & Record<Exclude<keyof I, keyof MsgEditValidator>, never>>(object: I): MsgEditValidator;
};
export declare const MsgEditValidatorResponse: {
    encode(_: MsgEditValidatorResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgEditValidatorResponse;
    fromJSON(_: any): MsgEditValidatorResponse;
    toJSON(_: MsgEditValidatorResponse): unknown;
    fromPartial<I extends {} & {} & Record<Exclude<keyof I, never>, never>>(_: I): MsgEditValidatorResponse;
};
export declare const MsgDelegate: {
    encode(message: MsgDelegate, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgDelegate;
    fromJSON(object: any): MsgDelegate;
    toJSON(message: MsgDelegate): unknown;
    fromPartial<I extends {
        delegatorAddress?: string | undefined;
        validatorAddress?: string | undefined;
        amount?: {
            denom?: string | undefined;
            amount?: string | undefined;
        } | undefined;
    } & {
        delegatorAddress?: string | undefined;
        validatorAddress?: string | undefined;
        amount?: ({
            denom?: string | undefined;
            amount?: string | undefined;
        } & {
            denom?: string | undefined;
            amount?: string | undefined;
        } & Record<Exclude<keyof I["amount"], keyof Coin>, never>) | undefined;
    } & Record<Exclude<keyof I, keyof MsgDelegate>, never>>(object: I): MsgDelegate;
};
export declare const MsgDelegateResponse: {
    encode(_: MsgDelegateResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgDelegateResponse;
    fromJSON(_: any): MsgDelegateResponse;
    toJSON(_: MsgDelegateResponse): unknown;
    fromPartial<I extends {} & {} & Record<Exclude<keyof I, never>, never>>(_: I): MsgDelegateResponse;
};
export declare const MsgBeginRedelegate: {
    encode(message: MsgBeginRedelegate, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgBeginRedelegate;
    fromJSON(object: any): MsgBeginRedelegate;
    toJSON(message: MsgBeginRedelegate): unknown;
    fromPartial<I extends {
        delegatorAddress?: string | undefined;
        validatorSrcAddress?: string | undefined;
        validatorDstAddress?: string | undefined;
        amount?: {
            denom?: string | undefined;
            amount?: string | undefined;
        } | undefined;
    } & {
        delegatorAddress?: string | undefined;
        validatorSrcAddress?: string | undefined;
        validatorDstAddress?: string | undefined;
        amount?: ({
            denom?: string | undefined;
            amount?: string | undefined;
        } & {
            denom?: string | undefined;
            amount?: string | undefined;
        } & Record<Exclude<keyof I["amount"], keyof Coin>, never>) | undefined;
    } & Record<Exclude<keyof I, keyof MsgBeginRedelegate>, never>>(object: I): MsgBeginRedelegate;
};
export declare const MsgBeginRedelegateResponse: {
    encode(message: MsgBeginRedelegateResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgBeginRedelegateResponse;
    fromJSON(object: any): MsgBeginRedelegateResponse;
    toJSON(message: MsgBeginRedelegateResponse): unknown;
    fromPartial<I extends {
        completionTime?: Date | undefined;
    } & {
        completionTime?: Date | undefined;
    } & Record<Exclude<keyof I, "completionTime">, never>>(object: I): MsgBeginRedelegateResponse;
};
export declare const MsgUndelegate: {
    encode(message: MsgUndelegate, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUndelegate;
    fromJSON(object: any): MsgUndelegate;
    toJSON(message: MsgUndelegate): unknown;
    fromPartial<I extends {
        delegatorAddress?: string | undefined;
        validatorAddress?: string | undefined;
        amount?: {
            denom?: string | undefined;
            amount?: string | undefined;
        } | undefined;
    } & {
        delegatorAddress?: string | undefined;
        validatorAddress?: string | undefined;
        amount?: ({
            denom?: string | undefined;
            amount?: string | undefined;
        } & {
            denom?: string | undefined;
            amount?: string | undefined;
        } & Record<Exclude<keyof I["amount"], keyof Coin>, never>) | undefined;
    } & Record<Exclude<keyof I, keyof MsgUndelegate>, never>>(object: I): MsgUndelegate;
};
export declare const MsgUndelegateResponse: {
    encode(message: MsgUndelegateResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUndelegateResponse;
    fromJSON(object: any): MsgUndelegateResponse;
    toJSON(message: MsgUndelegateResponse): unknown;
    fromPartial<I extends {
        completionTime?: Date | undefined;
    } & {
        completionTime?: Date | undefined;
    } & Record<Exclude<keyof I, "completionTime">, never>>(object: I): MsgUndelegateResponse;
};
export declare const MsgUnbondValidator: {
    encode(message: MsgUnbondValidator, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUnbondValidator;
    fromJSON(object: any): MsgUnbondValidator;
    toJSON(message: MsgUnbondValidator): unknown;
    fromPartial<I extends {
        validatorAddress?: string | undefined;
    } & {
        validatorAddress?: string | undefined;
    } & Record<Exclude<keyof I, "validatorAddress">, never>>(object: I): MsgUnbondValidator;
};
export declare const MsgUnbondValidatorResponse: {
    encode(_: MsgUnbondValidatorResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgUnbondValidatorResponse;
    fromJSON(_: any): MsgUnbondValidatorResponse;
    toJSON(_: MsgUnbondValidatorResponse): unknown;
    fromPartial<I extends {} & {} & Record<Exclude<keyof I, never>, never>>(_: I): MsgUnbondValidatorResponse;
};
export declare const MsgCancelUnbondingDelegation: {
    encode(message: MsgCancelUnbondingDelegation, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgCancelUnbondingDelegation;
    fromJSON(object: any): MsgCancelUnbondingDelegation;
    toJSON(message: MsgCancelUnbondingDelegation): unknown;
    fromPartial<I extends {
        delegatorAddress?: string | undefined;
        validatorAddress?: string | undefined;
        amount?: {
            denom?: string | undefined;
            amount?: string | undefined;
        } | undefined;
        creationHeight?: string | undefined;
    } & {
        delegatorAddress?: string | undefined;
        validatorAddress?: string | undefined;
        amount?: ({
            denom?: string | undefined;
            amount?: string | undefined;
        } & {
            denom?: string | undefined;
            amount?: string | undefined;
        } & Record<Exclude<keyof I["amount"], keyof Coin>, never>) | undefined;
        creationHeight?: string | undefined;
    } & Record<Exclude<keyof I, keyof MsgCancelUnbondingDelegation>, never>>(object: I): MsgCancelUnbondingDelegation;
};
export declare const MsgCancelUnbondingDelegationResponse: {
    encode(_: MsgCancelUnbondingDelegationResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgCancelUnbondingDelegationResponse;
    fromJSON(_: any): MsgCancelUnbondingDelegationResponse;
    toJSON(_: MsgCancelUnbondingDelegationResponse): unknown;
    fromPartial<I extends {} & {} & Record<Exclude<keyof I, never>, never>>(_: I): MsgCancelUnbondingDelegationResponse;
};
export declare const MsgTokenizeShares: {
    encode(message: MsgTokenizeShares, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgTokenizeShares;
    fromJSON(object: any): MsgTokenizeShares;
    toJSON(message: MsgTokenizeShares): unknown;
    fromPartial<I extends {
        delegatorAddress?: string | undefined;
        validatorAddress?: string | undefined;
        amount?: {
            denom?: string | undefined;
            amount?: string | undefined;
        } | undefined;
        tokenizedShareOwner?: string | undefined;
    } & {
        delegatorAddress?: string | undefined;
        validatorAddress?: string | undefined;
        amount?: ({
            denom?: string | undefined;
            amount?: string | undefined;
        } & {
            denom?: string | undefined;
            amount?: string | undefined;
        } & Record<Exclude<keyof I["amount"], keyof Coin>, never>) | undefined;
        tokenizedShareOwner?: string | undefined;
    } & Record<Exclude<keyof I, keyof MsgTokenizeShares>, never>>(object: I): MsgTokenizeShares;
};
export declare const MsgTokenizeSharesResponse: {
    encode(message: MsgTokenizeSharesResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgTokenizeSharesResponse;
    fromJSON(object: any): MsgTokenizeSharesResponse;
    toJSON(message: MsgTokenizeSharesResponse): unknown;
    fromPartial<I extends {
        amount?: {
            denom?: string | undefined;
            amount?: string | undefined;
        } | undefined;
    } & {
        amount?: ({
            denom?: string | undefined;
            amount?: string | undefined;
        } & {
            denom?: string | undefined;
            amount?: string | undefined;
        } & Record<Exclude<keyof I["amount"], keyof Coin>, never>) | undefined;
    } & Record<Exclude<keyof I, "amount">, never>>(object: I): MsgTokenizeSharesResponse;
};
export declare const MsgRedeemTokensForShares: {
    encode(message: MsgRedeemTokensForShares, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgRedeemTokensForShares;
    fromJSON(object: any): MsgRedeemTokensForShares;
    toJSON(message: MsgRedeemTokensForShares): unknown;
    fromPartial<I extends {
        delegatorAddress?: string | undefined;
        amount?: {
            denom?: string | undefined;
            amount?: string | undefined;
        } | undefined;
    } & {
        delegatorAddress?: string | undefined;
        amount?: ({
            denom?: string | undefined;
            amount?: string | undefined;
        } & {
            denom?: string | undefined;
            amount?: string | undefined;
        } & Record<Exclude<keyof I["amount"], keyof Coin>, never>) | undefined;
    } & Record<Exclude<keyof I, keyof MsgRedeemTokensForShares>, never>>(object: I): MsgRedeemTokensForShares;
};
export declare const MsgRedeemTokensForSharesResponse: {
    encode(message: MsgRedeemTokensForSharesResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgRedeemTokensForSharesResponse;
    fromJSON(object: any): MsgRedeemTokensForSharesResponse;
    toJSON(message: MsgRedeemTokensForSharesResponse): unknown;
    fromPartial<I extends {
        amount?: {
            denom?: string | undefined;
            amount?: string | undefined;
        } | undefined;
    } & {
        amount?: ({
            denom?: string | undefined;
            amount?: string | undefined;
        } & {
            denom?: string | undefined;
            amount?: string | undefined;
        } & Record<Exclude<keyof I["amount"], keyof Coin>, never>) | undefined;
    } & Record<Exclude<keyof I, "amount">, never>>(object: I): MsgRedeemTokensForSharesResponse;
};
export declare const MsgTransferTokenizeShareRecord: {
    encode(message: MsgTransferTokenizeShareRecord, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgTransferTokenizeShareRecord;
    fromJSON(object: any): MsgTransferTokenizeShareRecord;
    toJSON(message: MsgTransferTokenizeShareRecord): unknown;
    fromPartial<I extends {
        tokenizeShareRecordId?: string | undefined;
        sender?: string | undefined;
        newOwner?: string | undefined;
    } & {
        tokenizeShareRecordId?: string | undefined;
        sender?: string | undefined;
        newOwner?: string | undefined;
    } & Record<Exclude<keyof I, keyof MsgTransferTokenizeShareRecord>, never>>(object: I): MsgTransferTokenizeShareRecord;
};
export declare const MsgTransferTokenizeShareRecordResponse: {
    encode(_: MsgTransferTokenizeShareRecordResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgTransferTokenizeShareRecordResponse;
    fromJSON(_: any): MsgTransferTokenizeShareRecordResponse;
    toJSON(_: MsgTransferTokenizeShareRecordResponse): unknown;
    fromPartial<I extends {} & {} & Record<Exclude<keyof I, never>, never>>(_: I): MsgTransferTokenizeShareRecordResponse;
};
export declare const MsgDisableTokenizeShares: {
    encode(message: MsgDisableTokenizeShares, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgDisableTokenizeShares;
    fromJSON(object: any): MsgDisableTokenizeShares;
    toJSON(message: MsgDisableTokenizeShares): unknown;
    fromPartial<I extends {
        delegatorAddress?: string | undefined;
    } & {
        delegatorAddress?: string | undefined;
    } & Record<Exclude<keyof I, "delegatorAddress">, never>>(object: I): MsgDisableTokenizeShares;
};
export declare const MsgDisableTokenizeSharesResponse: {
    encode(_: MsgDisableTokenizeSharesResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgDisableTokenizeSharesResponse;
    fromJSON(_: any): MsgDisableTokenizeSharesResponse;
    toJSON(_: MsgDisableTokenizeSharesResponse): unknown;
    fromPartial<I extends {} & {} & Record<Exclude<keyof I, never>, never>>(_: I): MsgDisableTokenizeSharesResponse;
};
export declare const MsgEnableTokenizeShares: {
    encode(message: MsgEnableTokenizeShares, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgEnableTokenizeShares;
    fromJSON(object: any): MsgEnableTokenizeShares;
    toJSON(message: MsgEnableTokenizeShares): unknown;
    fromPartial<I extends {
        delegatorAddress?: string | undefined;
    } & {
        delegatorAddress?: string | undefined;
    } & Record<Exclude<keyof I, "delegatorAddress">, never>>(object: I): MsgEnableTokenizeShares;
};
export declare const MsgEnableTokenizeSharesResponse: {
    encode(message: MsgEnableTokenizeSharesResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgEnableTokenizeSharesResponse;
    fromJSON(object: any): MsgEnableTokenizeSharesResponse;
    toJSON(message: MsgEnableTokenizeSharesResponse): unknown;
    fromPartial<I extends {
        completionTime?: Date | undefined;
    } & {
        completionTime?: Date | undefined;
    } & Record<Exclude<keyof I, "completionTime">, never>>(object: I): MsgEnableTokenizeSharesResponse;
};
export declare const MsgValidatorBond: {
    encode(message: MsgValidatorBond, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgValidatorBond;
    fromJSON(object: any): MsgValidatorBond;
    toJSON(message: MsgValidatorBond): unknown;
    fromPartial<I extends {
        delegatorAddress?: string | undefined;
        validatorAddress?: string | undefined;
    } & {
        delegatorAddress?: string | undefined;
        validatorAddress?: string | undefined;
    } & Record<Exclude<keyof I, keyof MsgValidatorBond>, never>>(object: I): MsgValidatorBond;
};
export declare const MsgValidatorBondResponse: {
    encode(_: MsgValidatorBondResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgValidatorBondResponse;
    fromJSON(_: any): MsgValidatorBondResponse;
    toJSON(_: MsgValidatorBondResponse): unknown;
    fromPartial<I extends {} & {} & Record<Exclude<keyof I, never>, never>>(_: I): MsgValidatorBondResponse;
};
/** Msg defines the staking Msg service. */
export interface Msg {
    /** CreateValidator defines a method for creating a new validator. */
    CreateValidator(request: MsgCreateValidator): Promise<MsgCreateValidatorResponse>;
    /** EditValidator defines a method for editing an existing validator. */
    EditValidator(request: MsgEditValidator): Promise<MsgEditValidatorResponse>;
    /**
     * Delegate defines a method for performing a delegation of coins
     * from a delegator to a validator.
     */
    Delegate(request: MsgDelegate): Promise<MsgDelegateResponse>;
    /**
     * BeginRedelegate defines a method for performing a redelegation
     * of coins from a delegator and source validator to a destination validator.
     */
    BeginRedelegate(request: MsgBeginRedelegate): Promise<MsgBeginRedelegateResponse>;
    /**
     * Undelegate defines a method for performing an undelegation from a
     * delegate and a validator.
     * This allows a validator to stop their services and jail themselves without
     * experiencing a slash
     */
    Undelegate(request: MsgUndelegate): Promise<MsgUndelegateResponse>;
    /**
     * UnbondValidator defines a method for performing the status transition for a validator
     * from bonded to unbonding
     */
    UnbondValidator(request: MsgUnbondValidator): Promise<MsgUnbondValidatorResponse>;
    /**
     * CancelUnbondingDelegation defines a method for performing canceling the unbonding delegation
     * and delegate back to previous validator.
     *
     * This has been backported from SDK 46 as a desirable safety feature for LSM.
     * If a liquid staking provider is exploited and the exploiter initiates an undelegation,
     * having access to CancelUnbondingDelegation allows the liquid staking provider to cancel
     * the undelegation with a software upgrade and thus avoid loss of user funds
     */
    CancelUnbondingDelegation(request: MsgCancelUnbondingDelegation): Promise<MsgCancelUnbondingDelegationResponse>;
    /** TokenizeShares defines a method for tokenizing shares from a validator. */
    TokenizeShares(request: MsgTokenizeShares): Promise<MsgTokenizeSharesResponse>;
    /**
     * RedeemTokensForShares defines a method for redeeming tokens from a validator for
     * shares.
     */
    RedeemTokensForShares(request: MsgRedeemTokensForShares): Promise<MsgRedeemTokensForSharesResponse>;
    /**
     * TransferTokenizeShareRecord defines a method to transfer ownership of
     * TokenizeShareRecord
     */
    TransferTokenizeShareRecord(request: MsgTransferTokenizeShareRecord): Promise<MsgTransferTokenizeShareRecordResponse>;
    /** DisableTokenizeShares defines a method to prevent the tokenization of an addresses stake */
    DisableTokenizeShares(request: MsgDisableTokenizeShares): Promise<MsgDisableTokenizeSharesResponse>;
    /**
     * EnableTokenizeShares defines a method to re-enable the tokenization of an addresseses stake
     * after it has been disabled
     */
    EnableTokenizeShares(request: MsgEnableTokenizeShares): Promise<MsgEnableTokenizeSharesResponse>;
    /** ValidatorBond defines a method for performing a validator self-bond */
    ValidatorBond(request: MsgValidatorBond): Promise<MsgValidatorBondResponse>;
}
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & Record<Exclude<keyof I, KeysOfUnion<P>>, never>;
export {};
