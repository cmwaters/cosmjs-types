/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "ics23";

export enum HashOp {
  /** NO_HASH - NO_HASH is the default if no data passed. Note this is an illegal argument some places. */
  NO_HASH = 0,
  SHA256 = 1,
  SHA512 = 2,
  KECCAK = 3,
  RIPEMD160 = 4,
  /** BITCOIN - ripemd160(sha256(x)) */
  BITCOIN = 5,
  UNRECOGNIZED = -1,
}

export function hashOpFromJSON(object: any): HashOp {
  switch (object) {
    case 0:
    case "NO_HASH":
      return HashOp.NO_HASH;
    case 1:
    case "SHA256":
      return HashOp.SHA256;
    case 2:
    case "SHA512":
      return HashOp.SHA512;
    case 3:
    case "KECCAK":
      return HashOp.KECCAK;
    case 4:
    case "RIPEMD160":
      return HashOp.RIPEMD160;
    case 5:
    case "BITCOIN":
      return HashOp.BITCOIN;
    case -1:
    case "UNRECOGNIZED":
    default:
      return HashOp.UNRECOGNIZED;
  }
}

export function hashOpToJSON(object: HashOp): string {
  switch (object) {
    case HashOp.NO_HASH:
      return "NO_HASH";
    case HashOp.SHA256:
      return "SHA256";
    case HashOp.SHA512:
      return "SHA512";
    case HashOp.KECCAK:
      return "KECCAK";
    case HashOp.RIPEMD160:
      return "RIPEMD160";
    case HashOp.BITCOIN:
      return "BITCOIN";
    default:
      return "UNKNOWN";
  }
}

/**
 * LengthOp defines how to process the key and value of the LeafOp
 * to include length information. After encoding the length with the given
 * algorithm, the length will be prepended to the key and value bytes.
 * (Each one with it's own encoded length)
 */
export enum LengthOp {
  /** NO_PREFIX - NO_PREFIX don't include any length info */
  NO_PREFIX = 0,
  /** VAR_PROTO - VAR_PROTO uses protobuf (and go-amino) varint encoding of the length */
  VAR_PROTO = 1,
  /** VAR_RLP - VAR_RLP uses rlp int encoding of the length */
  VAR_RLP = 2,
  /** FIXED32_BIG - FIXED32_BIG uses big-endian encoding of the length as a 32 bit integer */
  FIXED32_BIG = 3,
  /** FIXED32_LITTLE - FIXED32_LITTLE uses little-endian encoding of the length as a 32 bit integer */
  FIXED32_LITTLE = 4,
  /** FIXED64_BIG - FIXED64_BIG uses big-endian encoding of the length as a 64 bit integer */
  FIXED64_BIG = 5,
  /** FIXED64_LITTLE - FIXED64_LITTLE uses little-endian encoding of the length as a 64 bit integer */
  FIXED64_LITTLE = 6,
  /** REQUIRE_32_BYTES - REQUIRE_32_BYTES is like NONE, but will fail if the input is not exactly 32 bytes (sha256 output) */
  REQUIRE_32_BYTES = 7,
  /** REQUIRE_64_BYTES - REQUIRE_64_BYTES is like NONE, but will fail if the input is not exactly 64 bytes (sha512 output) */
  REQUIRE_64_BYTES = 8,
  UNRECOGNIZED = -1,
}

export function lengthOpFromJSON(object: any): LengthOp {
  switch (object) {
    case 0:
    case "NO_PREFIX":
      return LengthOp.NO_PREFIX;
    case 1:
    case "VAR_PROTO":
      return LengthOp.VAR_PROTO;
    case 2:
    case "VAR_RLP":
      return LengthOp.VAR_RLP;
    case 3:
    case "FIXED32_BIG":
      return LengthOp.FIXED32_BIG;
    case 4:
    case "FIXED32_LITTLE":
      return LengthOp.FIXED32_LITTLE;
    case 5:
    case "FIXED64_BIG":
      return LengthOp.FIXED64_BIG;
    case 6:
    case "FIXED64_LITTLE":
      return LengthOp.FIXED64_LITTLE;
    case 7:
    case "REQUIRE_32_BYTES":
      return LengthOp.REQUIRE_32_BYTES;
    case 8:
    case "REQUIRE_64_BYTES":
      return LengthOp.REQUIRE_64_BYTES;
    case -1:
    case "UNRECOGNIZED":
    default:
      return LengthOp.UNRECOGNIZED;
  }
}

export function lengthOpToJSON(object: LengthOp): string {
  switch (object) {
    case LengthOp.NO_PREFIX:
      return "NO_PREFIX";
    case LengthOp.VAR_PROTO:
      return "VAR_PROTO";
    case LengthOp.VAR_RLP:
      return "VAR_RLP";
    case LengthOp.FIXED32_BIG:
      return "FIXED32_BIG";
    case LengthOp.FIXED32_LITTLE:
      return "FIXED32_LITTLE";
    case LengthOp.FIXED64_BIG:
      return "FIXED64_BIG";
    case LengthOp.FIXED64_LITTLE:
      return "FIXED64_LITTLE";
    case LengthOp.REQUIRE_32_BYTES:
      return "REQUIRE_32_BYTES";
    case LengthOp.REQUIRE_64_BYTES:
      return "REQUIRE_64_BYTES";
    default:
      return "UNKNOWN";
  }
}

/**
 * ExistenceProof takes a key and a value and a set of steps to perform on it.
 * The result of peforming all these steps will provide a "root hash", which can
 * be compared to the value in a header.
 *
 * Since it is computationally infeasible to produce a hash collission for any of the used
 * cryptographic hash functions, if someone can provide a series of operations to transform
 * a given key and value into a root hash that matches some trusted root, these key and values
 * must be in the referenced merkle tree.
 *
 * The only possible issue is maliablity in LeafOp, such as providing extra prefix data,
 * which should be controlled by a spec. Eg. with lengthOp as NONE,
 * prefix = FOO, key = BAR, value = CHOICE
 * and
 * prefix = F, key = OOBAR, value = CHOICE
 * would produce the same value.
 *
 * With LengthOp this is tricker but not impossible. Which is why the "leafPrefixEqual" field
 * in the ProofSpec is valuable to prevent this mutability. And why all trees should
 * length-prefix the data before hashing it.
 */
export interface ExistenceProof {
  key: Uint8Array;
  value: Uint8Array;
  leaf?: LeafOp;
  path: InnerOp[];
}

/**
 * NonExistenceProof takes a proof of two neighbors, one left of the desired key,
 * one right of the desired key. If both proofs are valid AND they are neighbors,
 * then there is no valid proof for the given key.
 */
export interface NonExistenceProof {
  /** TODO: remove this as unnecessary??? we prove a range */
  key: Uint8Array;
  left?: ExistenceProof;
  right?: ExistenceProof;
}

/** CommitmentProof is either an ExistenceProof or a NonExistenceProof, or a Batch of such messages */
export interface CommitmentProof {
  exist?: ExistenceProof | undefined;
  nonexist?: NonExistenceProof | undefined;
  batch?: BatchProof | undefined;
  compressed?: CompressedBatchProof | undefined;
}

/**
 * LeafOp represents the raw key-value data we wish to prove, and
 * must be flexible to represent the internal transformation from
 * the original key-value pairs into the basis hash, for many existing
 * merkle trees.
 *
 * key and value are passed in. So that the signature of this operation is:
 * leafOp(key, value) -> output
 *
 * To process this, first prehash the keys and values if needed (ANY means no hash in this case):
 * hkey = prehashKey(key)
 * hvalue = prehashValue(value)
 *
 * Then combine the bytes, and hash it
 * output = hash(prefix || length(hkey) || hkey || length(hvalue) || hvalue)
 */
export interface LeafOp {
  hash: HashOp;
  prehashKey: HashOp;
  prehashValue: HashOp;
  length: LengthOp;
  /**
   * prefix is a fixed bytes that may optionally be included at the beginning to differentiate
   * a leaf node from an inner node.
   */
  prefix: Uint8Array;
}

/**
 * InnerOp represents a merkle-proof step that is not a leaf.
 * It represents concatenating two children and hashing them to provide the next result.
 *
 * The result of the previous step is passed in, so the signature of this op is:
 * innerOp(child) -> output
 *
 * The result of applying InnerOp should be:
 * output = op.hash(op.prefix || child || op.suffix)
 *
 * where the || operator is concatenation of binary data,
 * and child is the result of hashing all the tree below this step.
 *
 * Any special data, like prepending child with the length, or prepending the entire operation with
 * some value to differentiate from leaf nodes, should be included in prefix and suffix.
 * If either of prefix or suffix is empty, we just treat it as an empty string
 */
export interface InnerOp {
  hash: HashOp;
  prefix: Uint8Array;
  suffix: Uint8Array;
}

/**
 * ProofSpec defines what the expected parameters are for a given proof type.
 * This can be stored in the client and used to validate any incoming proofs.
 *
 * verify(ProofSpec, Proof) -> Proof | Error
 *
 * As demonstrated in tests, if we don't fix the algorithm used to calculate the
 * LeafHash for a given tree, there are many possible key-value pairs that can
 * generate a given hash (by interpretting the preimage differently).
 * We need this for proper security, requires client knows a priori what
 * tree format server uses. But not in code, rather a configuration object.
 */
export interface ProofSpec {
  /**
   * any field in the ExistenceProof must be the same as in this spec.
   * except Prefix, which is just the first bytes of prefix (spec can be longer)
   */
  leafSpec?: LeafOp;
  innerSpec?: InnerSpec;
  /** max_depth (if > 0) is the maximum number of InnerOps allowed (mainly for fixed-depth tries) */
  maxDepth: number;
  /** min_depth (if > 0) is the minimum number of InnerOps allowed (mainly for fixed-depth tries) */
  minDepth: number;
}

/**
 * InnerSpec contains all store-specific structure info to determine if two proofs from a
 * given store are neighbors.
 *
 * This enables:
 *
 * isLeftMost(spec: InnerSpec, op: InnerOp)
 * isRightMost(spec: InnerSpec, op: InnerOp)
 * isLeftNeighbor(spec: InnerSpec, left: InnerOp, right: InnerOp)
 */
export interface InnerSpec {
  /**
   * Child order is the ordering of the children node, must count from 0
   * iavl tree is [0, 1] (left then right)
   * merk is [0, 2, 1] (left, right, here)
   */
  childOrder: number[];
  childSize: number;
  minPrefixLength: number;
  maxPrefixLength: number;
  /** empty child is the prehash image that is used when one child is nil (eg. 20 bytes of 0) */
  emptyChild: Uint8Array;
  /** hash is the algorithm that must be used for each InnerOp */
  hash: HashOp;
}

/** BatchProof is a group of multiple proof types than can be compressed */
export interface BatchProof {
  entries: BatchEntry[];
}

/** Use BatchEntry not CommitmentProof, to avoid recursion */
export interface BatchEntry {
  exist?: ExistenceProof | undefined;
  nonexist?: NonExistenceProof | undefined;
}

export interface CompressedBatchProof {
  entries: CompressedBatchEntry[];
  lookupInners: InnerOp[];
}

/** Use BatchEntry not CommitmentProof, to avoid recursion */
export interface CompressedBatchEntry {
  exist?: CompressedExistenceProof | undefined;
  nonexist?: CompressedNonExistenceProof | undefined;
}

export interface CompressedExistenceProof {
  key: Uint8Array;
  value: Uint8Array;
  leaf?: LeafOp;
  /** these are indexes into the lookup_inners table in CompressedBatchProof */
  path: number[];
}

export interface CompressedNonExistenceProof {
  /** TODO: remove this as unnecessary??? we prove a range */
  key: Uint8Array;
  left?: CompressedExistenceProof;
  right?: CompressedExistenceProof;
}

const baseExistenceProof: object = {};

export const ExistenceProof = {
  encode(message: ExistenceProof, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key.length !== 0) {
      writer.uint32(10).bytes(message.key);
    }
    if (message.value.length !== 0) {
      writer.uint32(18).bytes(message.value);
    }
    if (message.leaf !== undefined) {
      LeafOp.encode(message.leaf, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.path) {
      InnerOp.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ExistenceProof {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseExistenceProof } as ExistenceProof;
    message.path = [];
    message.key = new Uint8Array();
    message.value = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.bytes();
          break;
        case 2:
          message.value = reader.bytes();
          break;
        case 3:
          message.leaf = LeafOp.decode(reader, reader.uint32());
          break;
        case 4:
          message.path.push(InnerOp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ExistenceProof {
    const message = { ...baseExistenceProof } as ExistenceProof;
    message.path = [];
    message.key = new Uint8Array();
    message.value = new Uint8Array();
    if (object.key !== undefined && object.key !== null) {
      message.key = bytesFromBase64(object.key);
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = bytesFromBase64(object.value);
    }
    if (object.leaf !== undefined && object.leaf !== null) {
      message.leaf = LeafOp.fromJSON(object.leaf);
    } else {
      message.leaf = undefined;
    }
    if (object.path !== undefined && object.path !== null) {
      for (const e of object.path) {
        message.path.push(InnerOp.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: ExistenceProof): unknown {
    const obj: any = {};
    message.key !== undefined &&
      (obj.key = base64FromBytes(message.key !== undefined ? message.key : new Uint8Array()));
    message.value !== undefined &&
      (obj.value = base64FromBytes(message.value !== undefined ? message.value : new Uint8Array()));
    message.leaf !== undefined && (obj.leaf = message.leaf ? LeafOp.toJSON(message.leaf) : undefined);
    if (message.path) {
      obj.path = message.path.map((e) => (e ? InnerOp.toJSON(e) : undefined));
    } else {
      obj.path = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<ExistenceProof>): ExistenceProof {
    const message = { ...baseExistenceProof } as ExistenceProof;
    message.key = object.key ?? new Uint8Array();
    message.value = object.value ?? new Uint8Array();
    if (object.leaf !== undefined && object.leaf !== null) {
      message.leaf = LeafOp.fromPartial(object.leaf);
    } else {
      message.leaf = undefined;
    }
    message.path = [];
    if (object.path !== undefined && object.path !== null) {
      for (const e of object.path) {
        message.path.push(InnerOp.fromPartial(e));
      }
    }
    return message;
  },
};

const baseNonExistenceProof: object = {};

export const NonExistenceProof = {
  encode(message: NonExistenceProof, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key.length !== 0) {
      writer.uint32(10).bytes(message.key);
    }
    if (message.left !== undefined) {
      ExistenceProof.encode(message.left, writer.uint32(18).fork()).ldelim();
    }
    if (message.right !== undefined) {
      ExistenceProof.encode(message.right, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NonExistenceProof {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseNonExistenceProof } as NonExistenceProof;
    message.key = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.bytes();
          break;
        case 2:
          message.left = ExistenceProof.decode(reader, reader.uint32());
          break;
        case 3:
          message.right = ExistenceProof.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NonExistenceProof {
    const message = { ...baseNonExistenceProof } as NonExistenceProof;
    message.key = new Uint8Array();
    if (object.key !== undefined && object.key !== null) {
      message.key = bytesFromBase64(object.key);
    }
    if (object.left !== undefined && object.left !== null) {
      message.left = ExistenceProof.fromJSON(object.left);
    } else {
      message.left = undefined;
    }
    if (object.right !== undefined && object.right !== null) {
      message.right = ExistenceProof.fromJSON(object.right);
    } else {
      message.right = undefined;
    }
    return message;
  },

  toJSON(message: NonExistenceProof): unknown {
    const obj: any = {};
    message.key !== undefined &&
      (obj.key = base64FromBytes(message.key !== undefined ? message.key : new Uint8Array()));
    message.left !== undefined && (obj.left = message.left ? ExistenceProof.toJSON(message.left) : undefined);
    message.right !== undefined &&
      (obj.right = message.right ? ExistenceProof.toJSON(message.right) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<NonExistenceProof>): NonExistenceProof {
    const message = { ...baseNonExistenceProof } as NonExistenceProof;
    message.key = object.key ?? new Uint8Array();
    if (object.left !== undefined && object.left !== null) {
      message.left = ExistenceProof.fromPartial(object.left);
    } else {
      message.left = undefined;
    }
    if (object.right !== undefined && object.right !== null) {
      message.right = ExistenceProof.fromPartial(object.right);
    } else {
      message.right = undefined;
    }
    return message;
  },
};

const baseCommitmentProof: object = {};

export const CommitmentProof = {
  encode(message: CommitmentProof, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.exist !== undefined) {
      ExistenceProof.encode(message.exist, writer.uint32(10).fork()).ldelim();
    }
    if (message.nonexist !== undefined) {
      NonExistenceProof.encode(message.nonexist, writer.uint32(18).fork()).ldelim();
    }
    if (message.batch !== undefined) {
      BatchProof.encode(message.batch, writer.uint32(26).fork()).ldelim();
    }
    if (message.compressed !== undefined) {
      CompressedBatchProof.encode(message.compressed, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CommitmentProof {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCommitmentProof } as CommitmentProof;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.exist = ExistenceProof.decode(reader, reader.uint32());
          break;
        case 2:
          message.nonexist = NonExistenceProof.decode(reader, reader.uint32());
          break;
        case 3:
          message.batch = BatchProof.decode(reader, reader.uint32());
          break;
        case 4:
          message.compressed = CompressedBatchProof.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CommitmentProof {
    const message = { ...baseCommitmentProof } as CommitmentProof;
    if (object.exist !== undefined && object.exist !== null) {
      message.exist = ExistenceProof.fromJSON(object.exist);
    } else {
      message.exist = undefined;
    }
    if (object.nonexist !== undefined && object.nonexist !== null) {
      message.nonexist = NonExistenceProof.fromJSON(object.nonexist);
    } else {
      message.nonexist = undefined;
    }
    if (object.batch !== undefined && object.batch !== null) {
      message.batch = BatchProof.fromJSON(object.batch);
    } else {
      message.batch = undefined;
    }
    if (object.compressed !== undefined && object.compressed !== null) {
      message.compressed = CompressedBatchProof.fromJSON(object.compressed);
    } else {
      message.compressed = undefined;
    }
    return message;
  },

  toJSON(message: CommitmentProof): unknown {
    const obj: any = {};
    message.exist !== undefined &&
      (obj.exist = message.exist ? ExistenceProof.toJSON(message.exist) : undefined);
    message.nonexist !== undefined &&
      (obj.nonexist = message.nonexist ? NonExistenceProof.toJSON(message.nonexist) : undefined);
    message.batch !== undefined && (obj.batch = message.batch ? BatchProof.toJSON(message.batch) : undefined);
    message.compressed !== undefined &&
      (obj.compressed = message.compressed ? CompressedBatchProof.toJSON(message.compressed) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<CommitmentProof>): CommitmentProof {
    const message = { ...baseCommitmentProof } as CommitmentProof;
    if (object.exist !== undefined && object.exist !== null) {
      message.exist = ExistenceProof.fromPartial(object.exist);
    } else {
      message.exist = undefined;
    }
    if (object.nonexist !== undefined && object.nonexist !== null) {
      message.nonexist = NonExistenceProof.fromPartial(object.nonexist);
    } else {
      message.nonexist = undefined;
    }
    if (object.batch !== undefined && object.batch !== null) {
      message.batch = BatchProof.fromPartial(object.batch);
    } else {
      message.batch = undefined;
    }
    if (object.compressed !== undefined && object.compressed !== null) {
      message.compressed = CompressedBatchProof.fromPartial(object.compressed);
    } else {
      message.compressed = undefined;
    }
    return message;
  },
};

const baseLeafOp: object = { hash: 0, prehashKey: 0, prehashValue: 0, length: 0 };

export const LeafOp = {
  encode(message: LeafOp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.hash !== 0) {
      writer.uint32(8).int32(message.hash);
    }
    if (message.prehashKey !== 0) {
      writer.uint32(16).int32(message.prehashKey);
    }
    if (message.prehashValue !== 0) {
      writer.uint32(24).int32(message.prehashValue);
    }
    if (message.length !== 0) {
      writer.uint32(32).int32(message.length);
    }
    if (message.prefix.length !== 0) {
      writer.uint32(42).bytes(message.prefix);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LeafOp {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseLeafOp } as LeafOp;
    message.prefix = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.hash = reader.int32() as any;
          break;
        case 2:
          message.prehashKey = reader.int32() as any;
          break;
        case 3:
          message.prehashValue = reader.int32() as any;
          break;
        case 4:
          message.length = reader.int32() as any;
          break;
        case 5:
          message.prefix = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LeafOp {
    const message = { ...baseLeafOp } as LeafOp;
    message.prefix = new Uint8Array();
    if (object.hash !== undefined && object.hash !== null) {
      message.hash = hashOpFromJSON(object.hash);
    } else {
      message.hash = 0;
    }
    if (object.prehashKey !== undefined && object.prehashKey !== null) {
      message.prehashKey = hashOpFromJSON(object.prehashKey);
    } else {
      message.prehashKey = 0;
    }
    if (object.prehashValue !== undefined && object.prehashValue !== null) {
      message.prehashValue = hashOpFromJSON(object.prehashValue);
    } else {
      message.prehashValue = 0;
    }
    if (object.length !== undefined && object.length !== null) {
      message.length = lengthOpFromJSON(object.length);
    } else {
      message.length = 0;
    }
    if (object.prefix !== undefined && object.prefix !== null) {
      message.prefix = bytesFromBase64(object.prefix);
    }
    return message;
  },

  toJSON(message: LeafOp): unknown {
    const obj: any = {};
    message.hash !== undefined && (obj.hash = hashOpToJSON(message.hash));
    message.prehashKey !== undefined && (obj.prehashKey = hashOpToJSON(message.prehashKey));
    message.prehashValue !== undefined && (obj.prehashValue = hashOpToJSON(message.prehashValue));
    message.length !== undefined && (obj.length = lengthOpToJSON(message.length));
    message.prefix !== undefined &&
      (obj.prefix = base64FromBytes(message.prefix !== undefined ? message.prefix : new Uint8Array()));
    return obj;
  },

  fromPartial(object: DeepPartial<LeafOp>): LeafOp {
    const message = { ...baseLeafOp } as LeafOp;
    message.hash = object.hash ?? 0;
    message.prehashKey = object.prehashKey ?? 0;
    message.prehashValue = object.prehashValue ?? 0;
    message.length = object.length ?? 0;
    message.prefix = object.prefix ?? new Uint8Array();
    return message;
  },
};

const baseInnerOp: object = { hash: 0 };

export const InnerOp = {
  encode(message: InnerOp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.hash !== 0) {
      writer.uint32(8).int32(message.hash);
    }
    if (message.prefix.length !== 0) {
      writer.uint32(18).bytes(message.prefix);
    }
    if (message.suffix.length !== 0) {
      writer.uint32(26).bytes(message.suffix);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): InnerOp {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseInnerOp } as InnerOp;
    message.prefix = new Uint8Array();
    message.suffix = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.hash = reader.int32() as any;
          break;
        case 2:
          message.prefix = reader.bytes();
          break;
        case 3:
          message.suffix = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): InnerOp {
    const message = { ...baseInnerOp } as InnerOp;
    message.prefix = new Uint8Array();
    message.suffix = new Uint8Array();
    if (object.hash !== undefined && object.hash !== null) {
      message.hash = hashOpFromJSON(object.hash);
    } else {
      message.hash = 0;
    }
    if (object.prefix !== undefined && object.prefix !== null) {
      message.prefix = bytesFromBase64(object.prefix);
    }
    if (object.suffix !== undefined && object.suffix !== null) {
      message.suffix = bytesFromBase64(object.suffix);
    }
    return message;
  },

  toJSON(message: InnerOp): unknown {
    const obj: any = {};
    message.hash !== undefined && (obj.hash = hashOpToJSON(message.hash));
    message.prefix !== undefined &&
      (obj.prefix = base64FromBytes(message.prefix !== undefined ? message.prefix : new Uint8Array()));
    message.suffix !== undefined &&
      (obj.suffix = base64FromBytes(message.suffix !== undefined ? message.suffix : new Uint8Array()));
    return obj;
  },

  fromPartial(object: DeepPartial<InnerOp>): InnerOp {
    const message = { ...baseInnerOp } as InnerOp;
    message.hash = object.hash ?? 0;
    message.prefix = object.prefix ?? new Uint8Array();
    message.suffix = object.suffix ?? new Uint8Array();
    return message;
  },
};

const baseProofSpec: object = { maxDepth: 0, minDepth: 0 };

export const ProofSpec = {
  encode(message: ProofSpec, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.leafSpec !== undefined) {
      LeafOp.encode(message.leafSpec, writer.uint32(10).fork()).ldelim();
    }
    if (message.innerSpec !== undefined) {
      InnerSpec.encode(message.innerSpec, writer.uint32(18).fork()).ldelim();
    }
    if (message.maxDepth !== 0) {
      writer.uint32(24).int32(message.maxDepth);
    }
    if (message.minDepth !== 0) {
      writer.uint32(32).int32(message.minDepth);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProofSpec {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseProofSpec } as ProofSpec;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.leafSpec = LeafOp.decode(reader, reader.uint32());
          break;
        case 2:
          message.innerSpec = InnerSpec.decode(reader, reader.uint32());
          break;
        case 3:
          message.maxDepth = reader.int32();
          break;
        case 4:
          message.minDepth = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ProofSpec {
    const message = { ...baseProofSpec } as ProofSpec;
    if (object.leafSpec !== undefined && object.leafSpec !== null) {
      message.leafSpec = LeafOp.fromJSON(object.leafSpec);
    } else {
      message.leafSpec = undefined;
    }
    if (object.innerSpec !== undefined && object.innerSpec !== null) {
      message.innerSpec = InnerSpec.fromJSON(object.innerSpec);
    } else {
      message.innerSpec = undefined;
    }
    if (object.maxDepth !== undefined && object.maxDepth !== null) {
      message.maxDepth = Number(object.maxDepth);
    } else {
      message.maxDepth = 0;
    }
    if (object.minDepth !== undefined && object.minDepth !== null) {
      message.minDepth = Number(object.minDepth);
    } else {
      message.minDepth = 0;
    }
    return message;
  },

  toJSON(message: ProofSpec): unknown {
    const obj: any = {};
    message.leafSpec !== undefined &&
      (obj.leafSpec = message.leafSpec ? LeafOp.toJSON(message.leafSpec) : undefined);
    message.innerSpec !== undefined &&
      (obj.innerSpec = message.innerSpec ? InnerSpec.toJSON(message.innerSpec) : undefined);
    message.maxDepth !== undefined && (obj.maxDepth = message.maxDepth);
    message.minDepth !== undefined && (obj.minDepth = message.minDepth);
    return obj;
  },

  fromPartial(object: DeepPartial<ProofSpec>): ProofSpec {
    const message = { ...baseProofSpec } as ProofSpec;
    if (object.leafSpec !== undefined && object.leafSpec !== null) {
      message.leafSpec = LeafOp.fromPartial(object.leafSpec);
    } else {
      message.leafSpec = undefined;
    }
    if (object.innerSpec !== undefined && object.innerSpec !== null) {
      message.innerSpec = InnerSpec.fromPartial(object.innerSpec);
    } else {
      message.innerSpec = undefined;
    }
    message.maxDepth = object.maxDepth ?? 0;
    message.minDepth = object.minDepth ?? 0;
    return message;
  },
};

const baseInnerSpec: object = {
  childOrder: 0,
  childSize: 0,
  minPrefixLength: 0,
  maxPrefixLength: 0,
  hash: 0,
};

export const InnerSpec = {
  encode(message: InnerSpec, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    writer.uint32(10).fork();
    for (const v of message.childOrder) {
      writer.int32(v);
    }
    writer.ldelim();
    if (message.childSize !== 0) {
      writer.uint32(16).int32(message.childSize);
    }
    if (message.minPrefixLength !== 0) {
      writer.uint32(24).int32(message.minPrefixLength);
    }
    if (message.maxPrefixLength !== 0) {
      writer.uint32(32).int32(message.maxPrefixLength);
    }
    if (message.emptyChild.length !== 0) {
      writer.uint32(42).bytes(message.emptyChild);
    }
    if (message.hash !== 0) {
      writer.uint32(48).int32(message.hash);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): InnerSpec {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseInnerSpec } as InnerSpec;
    message.childOrder = [];
    message.emptyChild = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.childOrder.push(reader.int32());
            }
          } else {
            message.childOrder.push(reader.int32());
          }
          break;
        case 2:
          message.childSize = reader.int32();
          break;
        case 3:
          message.minPrefixLength = reader.int32();
          break;
        case 4:
          message.maxPrefixLength = reader.int32();
          break;
        case 5:
          message.emptyChild = reader.bytes();
          break;
        case 6:
          message.hash = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): InnerSpec {
    const message = { ...baseInnerSpec } as InnerSpec;
    message.childOrder = [];
    message.emptyChild = new Uint8Array();
    if (object.childOrder !== undefined && object.childOrder !== null) {
      for (const e of object.childOrder) {
        message.childOrder.push(Number(e));
      }
    }
    if (object.childSize !== undefined && object.childSize !== null) {
      message.childSize = Number(object.childSize);
    } else {
      message.childSize = 0;
    }
    if (object.minPrefixLength !== undefined && object.minPrefixLength !== null) {
      message.minPrefixLength = Number(object.minPrefixLength);
    } else {
      message.minPrefixLength = 0;
    }
    if (object.maxPrefixLength !== undefined && object.maxPrefixLength !== null) {
      message.maxPrefixLength = Number(object.maxPrefixLength);
    } else {
      message.maxPrefixLength = 0;
    }
    if (object.emptyChild !== undefined && object.emptyChild !== null) {
      message.emptyChild = bytesFromBase64(object.emptyChild);
    }
    if (object.hash !== undefined && object.hash !== null) {
      message.hash = hashOpFromJSON(object.hash);
    } else {
      message.hash = 0;
    }
    return message;
  },

  toJSON(message: InnerSpec): unknown {
    const obj: any = {};
    if (message.childOrder) {
      obj.childOrder = message.childOrder.map((e) => e);
    } else {
      obj.childOrder = [];
    }
    message.childSize !== undefined && (obj.childSize = message.childSize);
    message.minPrefixLength !== undefined && (obj.minPrefixLength = message.minPrefixLength);
    message.maxPrefixLength !== undefined && (obj.maxPrefixLength = message.maxPrefixLength);
    message.emptyChild !== undefined &&
      (obj.emptyChild = base64FromBytes(
        message.emptyChild !== undefined ? message.emptyChild : new Uint8Array(),
      ));
    message.hash !== undefined && (obj.hash = hashOpToJSON(message.hash));
    return obj;
  },

  fromPartial(object: DeepPartial<InnerSpec>): InnerSpec {
    const message = { ...baseInnerSpec } as InnerSpec;
    message.childOrder = [];
    if (object.childOrder !== undefined && object.childOrder !== null) {
      for (const e of object.childOrder) {
        message.childOrder.push(e);
      }
    }
    message.childSize = object.childSize ?? 0;
    message.minPrefixLength = object.minPrefixLength ?? 0;
    message.maxPrefixLength = object.maxPrefixLength ?? 0;
    message.emptyChild = object.emptyChild ?? new Uint8Array();
    message.hash = object.hash ?? 0;
    return message;
  },
};

const baseBatchProof: object = {};

export const BatchProof = {
  encode(message: BatchProof, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.entries) {
      BatchEntry.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BatchProof {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseBatchProof } as BatchProof;
    message.entries = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.entries.push(BatchEntry.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BatchProof {
    const message = { ...baseBatchProof } as BatchProof;
    message.entries = [];
    if (object.entries !== undefined && object.entries !== null) {
      for (const e of object.entries) {
        message.entries.push(BatchEntry.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: BatchProof): unknown {
    const obj: any = {};
    if (message.entries) {
      obj.entries = message.entries.map((e) => (e ? BatchEntry.toJSON(e) : undefined));
    } else {
      obj.entries = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<BatchProof>): BatchProof {
    const message = { ...baseBatchProof } as BatchProof;
    message.entries = [];
    if (object.entries !== undefined && object.entries !== null) {
      for (const e of object.entries) {
        message.entries.push(BatchEntry.fromPartial(e));
      }
    }
    return message;
  },
};

const baseBatchEntry: object = {};

export const BatchEntry = {
  encode(message: BatchEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.exist !== undefined) {
      ExistenceProof.encode(message.exist, writer.uint32(10).fork()).ldelim();
    }
    if (message.nonexist !== undefined) {
      NonExistenceProof.encode(message.nonexist, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BatchEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseBatchEntry } as BatchEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.exist = ExistenceProof.decode(reader, reader.uint32());
          break;
        case 2:
          message.nonexist = NonExistenceProof.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BatchEntry {
    const message = { ...baseBatchEntry } as BatchEntry;
    if (object.exist !== undefined && object.exist !== null) {
      message.exist = ExistenceProof.fromJSON(object.exist);
    } else {
      message.exist = undefined;
    }
    if (object.nonexist !== undefined && object.nonexist !== null) {
      message.nonexist = NonExistenceProof.fromJSON(object.nonexist);
    } else {
      message.nonexist = undefined;
    }
    return message;
  },

  toJSON(message: BatchEntry): unknown {
    const obj: any = {};
    message.exist !== undefined &&
      (obj.exist = message.exist ? ExistenceProof.toJSON(message.exist) : undefined);
    message.nonexist !== undefined &&
      (obj.nonexist = message.nonexist ? NonExistenceProof.toJSON(message.nonexist) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<BatchEntry>): BatchEntry {
    const message = { ...baseBatchEntry } as BatchEntry;
    if (object.exist !== undefined && object.exist !== null) {
      message.exist = ExistenceProof.fromPartial(object.exist);
    } else {
      message.exist = undefined;
    }
    if (object.nonexist !== undefined && object.nonexist !== null) {
      message.nonexist = NonExistenceProof.fromPartial(object.nonexist);
    } else {
      message.nonexist = undefined;
    }
    return message;
  },
};

const baseCompressedBatchProof: object = {};

export const CompressedBatchProof = {
  encode(message: CompressedBatchProof, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.entries) {
      CompressedBatchEntry.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.lookupInners) {
      InnerOp.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CompressedBatchProof {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCompressedBatchProof } as CompressedBatchProof;
    message.entries = [];
    message.lookupInners = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.entries.push(CompressedBatchEntry.decode(reader, reader.uint32()));
          break;
        case 2:
          message.lookupInners.push(InnerOp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CompressedBatchProof {
    const message = { ...baseCompressedBatchProof } as CompressedBatchProof;
    message.entries = [];
    message.lookupInners = [];
    if (object.entries !== undefined && object.entries !== null) {
      for (const e of object.entries) {
        message.entries.push(CompressedBatchEntry.fromJSON(e));
      }
    }
    if (object.lookupInners !== undefined && object.lookupInners !== null) {
      for (const e of object.lookupInners) {
        message.lookupInners.push(InnerOp.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: CompressedBatchProof): unknown {
    const obj: any = {};
    if (message.entries) {
      obj.entries = message.entries.map((e) => (e ? CompressedBatchEntry.toJSON(e) : undefined));
    } else {
      obj.entries = [];
    }
    if (message.lookupInners) {
      obj.lookupInners = message.lookupInners.map((e) => (e ? InnerOp.toJSON(e) : undefined));
    } else {
      obj.lookupInners = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<CompressedBatchProof>): CompressedBatchProof {
    const message = { ...baseCompressedBatchProof } as CompressedBatchProof;
    message.entries = [];
    if (object.entries !== undefined && object.entries !== null) {
      for (const e of object.entries) {
        message.entries.push(CompressedBatchEntry.fromPartial(e));
      }
    }
    message.lookupInners = [];
    if (object.lookupInners !== undefined && object.lookupInners !== null) {
      for (const e of object.lookupInners) {
        message.lookupInners.push(InnerOp.fromPartial(e));
      }
    }
    return message;
  },
};

const baseCompressedBatchEntry: object = {};

export const CompressedBatchEntry = {
  encode(message: CompressedBatchEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.exist !== undefined) {
      CompressedExistenceProof.encode(message.exist, writer.uint32(10).fork()).ldelim();
    }
    if (message.nonexist !== undefined) {
      CompressedNonExistenceProof.encode(message.nonexist, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CompressedBatchEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCompressedBatchEntry } as CompressedBatchEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.exist = CompressedExistenceProof.decode(reader, reader.uint32());
          break;
        case 2:
          message.nonexist = CompressedNonExistenceProof.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CompressedBatchEntry {
    const message = { ...baseCompressedBatchEntry } as CompressedBatchEntry;
    if (object.exist !== undefined && object.exist !== null) {
      message.exist = CompressedExistenceProof.fromJSON(object.exist);
    } else {
      message.exist = undefined;
    }
    if (object.nonexist !== undefined && object.nonexist !== null) {
      message.nonexist = CompressedNonExistenceProof.fromJSON(object.nonexist);
    } else {
      message.nonexist = undefined;
    }
    return message;
  },

  toJSON(message: CompressedBatchEntry): unknown {
    const obj: any = {};
    message.exist !== undefined &&
      (obj.exist = message.exist ? CompressedExistenceProof.toJSON(message.exist) : undefined);
    message.nonexist !== undefined &&
      (obj.nonexist = message.nonexist ? CompressedNonExistenceProof.toJSON(message.nonexist) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<CompressedBatchEntry>): CompressedBatchEntry {
    const message = { ...baseCompressedBatchEntry } as CompressedBatchEntry;
    if (object.exist !== undefined && object.exist !== null) {
      message.exist = CompressedExistenceProof.fromPartial(object.exist);
    } else {
      message.exist = undefined;
    }
    if (object.nonexist !== undefined && object.nonexist !== null) {
      message.nonexist = CompressedNonExistenceProof.fromPartial(object.nonexist);
    } else {
      message.nonexist = undefined;
    }
    return message;
  },
};

const baseCompressedExistenceProof: object = { path: 0 };

export const CompressedExistenceProof = {
  encode(message: CompressedExistenceProof, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key.length !== 0) {
      writer.uint32(10).bytes(message.key);
    }
    if (message.value.length !== 0) {
      writer.uint32(18).bytes(message.value);
    }
    if (message.leaf !== undefined) {
      LeafOp.encode(message.leaf, writer.uint32(26).fork()).ldelim();
    }
    writer.uint32(34).fork();
    for (const v of message.path) {
      writer.int32(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CompressedExistenceProof {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCompressedExistenceProof } as CompressedExistenceProof;
    message.path = [];
    message.key = new Uint8Array();
    message.value = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.bytes();
          break;
        case 2:
          message.value = reader.bytes();
          break;
        case 3:
          message.leaf = LeafOp.decode(reader, reader.uint32());
          break;
        case 4:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.path.push(reader.int32());
            }
          } else {
            message.path.push(reader.int32());
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CompressedExistenceProof {
    const message = { ...baseCompressedExistenceProof } as CompressedExistenceProof;
    message.path = [];
    message.key = new Uint8Array();
    message.value = new Uint8Array();
    if (object.key !== undefined && object.key !== null) {
      message.key = bytesFromBase64(object.key);
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = bytesFromBase64(object.value);
    }
    if (object.leaf !== undefined && object.leaf !== null) {
      message.leaf = LeafOp.fromJSON(object.leaf);
    } else {
      message.leaf = undefined;
    }
    if (object.path !== undefined && object.path !== null) {
      for (const e of object.path) {
        message.path.push(Number(e));
      }
    }
    return message;
  },

  toJSON(message: CompressedExistenceProof): unknown {
    const obj: any = {};
    message.key !== undefined &&
      (obj.key = base64FromBytes(message.key !== undefined ? message.key : new Uint8Array()));
    message.value !== undefined &&
      (obj.value = base64FromBytes(message.value !== undefined ? message.value : new Uint8Array()));
    message.leaf !== undefined && (obj.leaf = message.leaf ? LeafOp.toJSON(message.leaf) : undefined);
    if (message.path) {
      obj.path = message.path.map((e) => e);
    } else {
      obj.path = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<CompressedExistenceProof>): CompressedExistenceProof {
    const message = { ...baseCompressedExistenceProof } as CompressedExistenceProof;
    message.key = object.key ?? new Uint8Array();
    message.value = object.value ?? new Uint8Array();
    if (object.leaf !== undefined && object.leaf !== null) {
      message.leaf = LeafOp.fromPartial(object.leaf);
    } else {
      message.leaf = undefined;
    }
    message.path = [];
    if (object.path !== undefined && object.path !== null) {
      for (const e of object.path) {
        message.path.push(e);
      }
    }
    return message;
  },
};

const baseCompressedNonExistenceProof: object = {};

export const CompressedNonExistenceProof = {
  encode(message: CompressedNonExistenceProof, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key.length !== 0) {
      writer.uint32(10).bytes(message.key);
    }
    if (message.left !== undefined) {
      CompressedExistenceProof.encode(message.left, writer.uint32(18).fork()).ldelim();
    }
    if (message.right !== undefined) {
      CompressedExistenceProof.encode(message.right, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CompressedNonExistenceProof {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCompressedNonExistenceProof } as CompressedNonExistenceProof;
    message.key = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.bytes();
          break;
        case 2:
          message.left = CompressedExistenceProof.decode(reader, reader.uint32());
          break;
        case 3:
          message.right = CompressedExistenceProof.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CompressedNonExistenceProof {
    const message = { ...baseCompressedNonExistenceProof } as CompressedNonExistenceProof;
    message.key = new Uint8Array();
    if (object.key !== undefined && object.key !== null) {
      message.key = bytesFromBase64(object.key);
    }
    if (object.left !== undefined && object.left !== null) {
      message.left = CompressedExistenceProof.fromJSON(object.left);
    } else {
      message.left = undefined;
    }
    if (object.right !== undefined && object.right !== null) {
      message.right = CompressedExistenceProof.fromJSON(object.right);
    } else {
      message.right = undefined;
    }
    return message;
  },

  toJSON(message: CompressedNonExistenceProof): unknown {
    const obj: any = {};
    message.key !== undefined &&
      (obj.key = base64FromBytes(message.key !== undefined ? message.key : new Uint8Array()));
    message.left !== undefined &&
      (obj.left = message.left ? CompressedExistenceProof.toJSON(message.left) : undefined);
    message.right !== undefined &&
      (obj.right = message.right ? CompressedExistenceProof.toJSON(message.right) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<CompressedNonExistenceProof>): CompressedNonExistenceProof {
    const message = { ...baseCompressedNonExistenceProof } as CompressedNonExistenceProof;
    message.key = object.key ?? new Uint8Array();
    if (object.left !== undefined && object.left !== null) {
      message.left = CompressedExistenceProof.fromPartial(object.left);
    } else {
      message.left = undefined;
    }
    if (object.right !== undefined && object.right !== null) {
      message.right = CompressedExistenceProof.fromPartial(object.right);
    } else {
      message.right = undefined;
    }
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

const atob: (b64: string) => string =
  globalThis.atob || ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

const btoa: (bin: string) => string =
  globalThis.btoa || ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  for (const byte of arr) {
    bin.push(String.fromCharCode(byte));
  }
  return btoa(bin.join(""));
}

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

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
