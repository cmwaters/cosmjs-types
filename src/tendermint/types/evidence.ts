/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Vote, LightBlock } from "../../tendermint/types/types";
import { Timestamp } from "../../google/protobuf/timestamp";
import { Validator } from "../../tendermint/types/validator";

export const protobufPackage = "tendermint.types";

export interface Evidence {
  duplicateVoteEvidence?: DuplicateVoteEvidence | undefined;
  lightClientAttackEvidence?: LightClientAttackEvidence | undefined;
}

/** DuplicateVoteEvidence contains evidence of a validator signed two conflicting votes. */
export interface DuplicateVoteEvidence {
  voteA?: Vote;
  voteB?: Vote;
  totalVotingPower: Long;
  validatorPower: Long;
  timestamp?: Date;
}

/** LightClientAttackEvidence contains evidence of a set of validators attempting to mislead a light client. */
export interface LightClientAttackEvidence {
  conflictingBlock?: LightBlock;
  commonHeight: Long;
  byzantineValidators: Validator[];
  totalVotingPower: Long;
  timestamp?: Date;
}

export interface EvidenceList {
  evidence: Evidence[];
}

const baseEvidence: object = {};

export const Evidence = {
  encode(message: Evidence, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.duplicateVoteEvidence !== undefined) {
      DuplicateVoteEvidence.encode(message.duplicateVoteEvidence, writer.uint32(10).fork()).ldelim();
    }
    if (message.lightClientAttackEvidence !== undefined) {
      LightClientAttackEvidence.encode(message.lightClientAttackEvidence, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Evidence {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseEvidence } as Evidence;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.duplicateVoteEvidence = DuplicateVoteEvidence.decode(reader, reader.uint32());
          break;
        case 2:
          message.lightClientAttackEvidence = LightClientAttackEvidence.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Evidence {
    const message = { ...baseEvidence } as Evidence;
    if (object.duplicateVoteEvidence !== undefined && object.duplicateVoteEvidence !== null) {
      message.duplicateVoteEvidence = DuplicateVoteEvidence.fromJSON(object.duplicateVoteEvidence);
    } else {
      message.duplicateVoteEvidence = undefined;
    }
    if (object.lightClientAttackEvidence !== undefined && object.lightClientAttackEvidence !== null) {
      message.lightClientAttackEvidence = LightClientAttackEvidence.fromJSON(
        object.lightClientAttackEvidence,
      );
    } else {
      message.lightClientAttackEvidence = undefined;
    }
    return message;
  },

  toJSON(message: Evidence): unknown {
    const obj: any = {};
    message.duplicateVoteEvidence !== undefined &&
      (obj.duplicateVoteEvidence = message.duplicateVoteEvidence
        ? DuplicateVoteEvidence.toJSON(message.duplicateVoteEvidence)
        : undefined);
    message.lightClientAttackEvidence !== undefined &&
      (obj.lightClientAttackEvidence = message.lightClientAttackEvidence
        ? LightClientAttackEvidence.toJSON(message.lightClientAttackEvidence)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Evidence>): Evidence {
    const message = { ...baseEvidence } as Evidence;
    if (object.duplicateVoteEvidence !== undefined && object.duplicateVoteEvidence !== null) {
      message.duplicateVoteEvidence = DuplicateVoteEvidence.fromPartial(object.duplicateVoteEvidence);
    } else {
      message.duplicateVoteEvidence = undefined;
    }
    if (object.lightClientAttackEvidence !== undefined && object.lightClientAttackEvidence !== null) {
      message.lightClientAttackEvidence = LightClientAttackEvidence.fromPartial(
        object.lightClientAttackEvidence,
      );
    } else {
      message.lightClientAttackEvidence = undefined;
    }
    return message;
  },
};

const baseDuplicateVoteEvidence: object = { totalVotingPower: Long.ZERO, validatorPower: Long.ZERO };

export const DuplicateVoteEvidence = {
  encode(message: DuplicateVoteEvidence, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.voteA !== undefined) {
      Vote.encode(message.voteA, writer.uint32(10).fork()).ldelim();
    }
    if (message.voteB !== undefined) {
      Vote.encode(message.voteB, writer.uint32(18).fork()).ldelim();
    }
    if (!message.totalVotingPower.isZero()) {
      writer.uint32(24).int64(message.totalVotingPower);
    }
    if (!message.validatorPower.isZero()) {
      writer.uint32(32).int64(message.validatorPower);
    }
    if (message.timestamp !== undefined) {
      Timestamp.encode(toTimestamp(message.timestamp), writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DuplicateVoteEvidence {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDuplicateVoteEvidence } as DuplicateVoteEvidence;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.voteA = Vote.decode(reader, reader.uint32());
          break;
        case 2:
          message.voteB = Vote.decode(reader, reader.uint32());
          break;
        case 3:
          message.totalVotingPower = reader.int64() as Long;
          break;
        case 4:
          message.validatorPower = reader.int64() as Long;
          break;
        case 5:
          message.timestamp = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DuplicateVoteEvidence {
    const message = { ...baseDuplicateVoteEvidence } as DuplicateVoteEvidence;
    if (object.voteA !== undefined && object.voteA !== null) {
      message.voteA = Vote.fromJSON(object.voteA);
    } else {
      message.voteA = undefined;
    }
    if (object.voteB !== undefined && object.voteB !== null) {
      message.voteB = Vote.fromJSON(object.voteB);
    } else {
      message.voteB = undefined;
    }
    if (object.totalVotingPower !== undefined && object.totalVotingPower !== null) {
      message.totalVotingPower = Long.fromString(object.totalVotingPower);
    } else {
      message.totalVotingPower = Long.ZERO;
    }
    if (object.validatorPower !== undefined && object.validatorPower !== null) {
      message.validatorPower = Long.fromString(object.validatorPower);
    } else {
      message.validatorPower = Long.ZERO;
    }
    if (object.timestamp !== undefined && object.timestamp !== null) {
      message.timestamp = fromJsonTimestamp(object.timestamp);
    } else {
      message.timestamp = undefined;
    }
    return message;
  },

  toJSON(message: DuplicateVoteEvidence): unknown {
    const obj: any = {};
    message.voteA !== undefined && (obj.voteA = message.voteA ? Vote.toJSON(message.voteA) : undefined);
    message.voteB !== undefined && (obj.voteB = message.voteB ? Vote.toJSON(message.voteB) : undefined);
    message.totalVotingPower !== undefined &&
      (obj.totalVotingPower = (message.totalVotingPower || Long.ZERO).toString());
    message.validatorPower !== undefined &&
      (obj.validatorPower = (message.validatorPower || Long.ZERO).toString());
    message.timestamp !== undefined && (obj.timestamp = message.timestamp.toISOString());
    return obj;
  },

  fromPartial(object: DeepPartial<DuplicateVoteEvidence>): DuplicateVoteEvidence {
    const message = { ...baseDuplicateVoteEvidence } as DuplicateVoteEvidence;
    if (object.voteA !== undefined && object.voteA !== null) {
      message.voteA = Vote.fromPartial(object.voteA);
    } else {
      message.voteA = undefined;
    }
    if (object.voteB !== undefined && object.voteB !== null) {
      message.voteB = Vote.fromPartial(object.voteB);
    } else {
      message.voteB = undefined;
    }
    if (object.totalVotingPower !== undefined && object.totalVotingPower !== null) {
      message.totalVotingPower = object.totalVotingPower as Long;
    } else {
      message.totalVotingPower = Long.ZERO;
    }
    if (object.validatorPower !== undefined && object.validatorPower !== null) {
      message.validatorPower = object.validatorPower as Long;
    } else {
      message.validatorPower = Long.ZERO;
    }
    message.timestamp = object.timestamp ?? undefined;
    return message;
  },
};

const baseLightClientAttackEvidence: object = { commonHeight: Long.ZERO, totalVotingPower: Long.ZERO };

export const LightClientAttackEvidence = {
  encode(message: LightClientAttackEvidence, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.conflictingBlock !== undefined) {
      LightBlock.encode(message.conflictingBlock, writer.uint32(10).fork()).ldelim();
    }
    if (!message.commonHeight.isZero()) {
      writer.uint32(16).int64(message.commonHeight);
    }
    for (const v of message.byzantineValidators) {
      Validator.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (!message.totalVotingPower.isZero()) {
      writer.uint32(32).int64(message.totalVotingPower);
    }
    if (message.timestamp !== undefined) {
      Timestamp.encode(toTimestamp(message.timestamp), writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LightClientAttackEvidence {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseLightClientAttackEvidence } as LightClientAttackEvidence;
    message.byzantineValidators = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.conflictingBlock = LightBlock.decode(reader, reader.uint32());
          break;
        case 2:
          message.commonHeight = reader.int64() as Long;
          break;
        case 3:
          message.byzantineValidators.push(Validator.decode(reader, reader.uint32()));
          break;
        case 4:
          message.totalVotingPower = reader.int64() as Long;
          break;
        case 5:
          message.timestamp = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LightClientAttackEvidence {
    const message = { ...baseLightClientAttackEvidence } as LightClientAttackEvidence;
    message.byzantineValidators = [];
    if (object.conflictingBlock !== undefined && object.conflictingBlock !== null) {
      message.conflictingBlock = LightBlock.fromJSON(object.conflictingBlock);
    } else {
      message.conflictingBlock = undefined;
    }
    if (object.commonHeight !== undefined && object.commonHeight !== null) {
      message.commonHeight = Long.fromString(object.commonHeight);
    } else {
      message.commonHeight = Long.ZERO;
    }
    if (object.byzantineValidators !== undefined && object.byzantineValidators !== null) {
      for (const e of object.byzantineValidators) {
        message.byzantineValidators.push(Validator.fromJSON(e));
      }
    }
    if (object.totalVotingPower !== undefined && object.totalVotingPower !== null) {
      message.totalVotingPower = Long.fromString(object.totalVotingPower);
    } else {
      message.totalVotingPower = Long.ZERO;
    }
    if (object.timestamp !== undefined && object.timestamp !== null) {
      message.timestamp = fromJsonTimestamp(object.timestamp);
    } else {
      message.timestamp = undefined;
    }
    return message;
  },

  toJSON(message: LightClientAttackEvidence): unknown {
    const obj: any = {};
    message.conflictingBlock !== undefined &&
      (obj.conflictingBlock = message.conflictingBlock
        ? LightBlock.toJSON(message.conflictingBlock)
        : undefined);
    message.commonHeight !== undefined && (obj.commonHeight = (message.commonHeight || Long.ZERO).toString());
    if (message.byzantineValidators) {
      obj.byzantineValidators = message.byzantineValidators.map((e) => (e ? Validator.toJSON(e) : undefined));
    } else {
      obj.byzantineValidators = [];
    }
    message.totalVotingPower !== undefined &&
      (obj.totalVotingPower = (message.totalVotingPower || Long.ZERO).toString());
    message.timestamp !== undefined && (obj.timestamp = message.timestamp.toISOString());
    return obj;
  },

  fromPartial(object: DeepPartial<LightClientAttackEvidence>): LightClientAttackEvidence {
    const message = { ...baseLightClientAttackEvidence } as LightClientAttackEvidence;
    if (object.conflictingBlock !== undefined && object.conflictingBlock !== null) {
      message.conflictingBlock = LightBlock.fromPartial(object.conflictingBlock);
    } else {
      message.conflictingBlock = undefined;
    }
    if (object.commonHeight !== undefined && object.commonHeight !== null) {
      message.commonHeight = object.commonHeight as Long;
    } else {
      message.commonHeight = Long.ZERO;
    }
    message.byzantineValidators = [];
    if (object.byzantineValidators !== undefined && object.byzantineValidators !== null) {
      for (const e of object.byzantineValidators) {
        message.byzantineValidators.push(Validator.fromPartial(e));
      }
    }
    if (object.totalVotingPower !== undefined && object.totalVotingPower !== null) {
      message.totalVotingPower = object.totalVotingPower as Long;
    } else {
      message.totalVotingPower = Long.ZERO;
    }
    message.timestamp = object.timestamp ?? undefined;
    return message;
  },
};

const baseEvidenceList: object = {};

export const EvidenceList = {
  encode(message: EvidenceList, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.evidence) {
      Evidence.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EvidenceList {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseEvidenceList } as EvidenceList;
    message.evidence = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.evidence.push(Evidence.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EvidenceList {
    const message = { ...baseEvidenceList } as EvidenceList;
    message.evidence = [];
    if (object.evidence !== undefined && object.evidence !== null) {
      for (const e of object.evidence) {
        message.evidence.push(Evidence.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: EvidenceList): unknown {
    const obj: any = {};
    if (message.evidence) {
      obj.evidence = message.evidence.map((e) => (e ? Evidence.toJSON(e) : undefined));
    } else {
      obj.evidence = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<EvidenceList>): EvidenceList {
    const message = { ...baseEvidenceList } as EvidenceList;
    message.evidence = [];
    if (object.evidence !== undefined && object.evidence !== null) {
      for (const e of object.evidence) {
        message.evidence.push(Evidence.fromPartial(e));
      }
    }
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined | Long;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function toTimestamp(date: Date): Timestamp {
  const seconds = numberToLong(date.getTime() / 1_000);
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds.toNumber() * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function numberToLong(number: number) {
  return Long.fromNumber(number);
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
