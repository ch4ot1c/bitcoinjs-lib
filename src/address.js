const Buffer = require('safe-buffer').Buffer
const bech32 = require('bech32')
const bs58check = require('bs58check')
const bscript = require('./script')
const networks = require('./networks')
const typeforce = require('typeforce')
const types = require('./types')
const payments = require('./payments')

const Z = false

function fromBase58Check (address) {
  var payload = bs58check.decode(address)

  // TODO: 4.0.0, move to "toOutputScript"
  if (payload.length < 21) throw new TypeError(address + ' is too short')
  if (payload.length > 22) throw new TypeError(address + ' is too long')

  var multibyte = payload.length === 22
  if (Z) {
    if (!multibyte) throw new TypeError('version is only 1 byte for a z network')
  }
  var offset = multibyte ? 2 : 1

  var version = multibyte ? payload.readUInt16BE(0) : payload.readUInt8(0)
  var hash = payload.slice(offset)

  return { version: version, hash: hash }
}

function fromBech32 (address) {
  const result = bech32.decode(address)
  const data = bech32.fromWords(result.words.slice(1))

  return {
    version: result.words[0],
    prefix: result.prefix,
    data: Buffer.from(data)
  }
}

function toBase58Check (hash, version) {
  typeforce(types.tuple(types.Hash160bit, types.UInt16), arguments)

  var multibyte = version > 0xff
  if (Z) {
    if (!multibyte) throw new TypeError('version is only 1 byte for a z network')
  }
  var size = multibyte ? 22 : 21
  var offset = multibyte ? 2 : 1

  var payload = Buffer.allocUnsafe(size)
  multibyte ? payload.writeUInt16BE(version, 0) : payload.writeUInt8(version, 0)
  hash.copy(payload, offset)

  return bs58check.encode(payload)
}

function toBech32 (data, version, prefix) {
  const words = bech32.toWords(data)
  words.unshift(version)

  return bech32.encode(prefix, words)
}

function fromOutputScript (output, network) {
  network = network || networks.bitcoin

  try { return payments.p2pkh({ output, network }).address } catch (e) {}
  try { return payments.p2sh({ output, network }).address } catch (e) {}
  try { return payments.p2wpkh({ output, network }).address } catch (e) {}
  try { return payments.p2wsh({ output, network }).address } catch (e) {}

  throw new Error(bscript.toASM(output) + ' has no matching Address')
}

function toOutputScript (address, network) {
  network = network || networks.bitcoin

  let decode
  try {
    decode = fromBase58Check(address)
  } catch (e) {}

  if (decode) {
    if (decode.version === network.pubKeyHash) return payments.p2pkh({ hash: decode.hash }).output
    if (decode.version === network.scriptHash) return payments.p2sh({ hash: decode.hash }).output
  } else {
    try {
      decode = fromBech32(address)
    } catch (e) {}

    if (decode) {
      if (decode.prefix !== network.bech32) throw new Error(address + ' has an invalid prefix')
      if (decode.version === 0) {
        if (decode.data.length === 20) return payments.p2wpkh({ hash: decode.data }).output
        if (decode.data.length === 32) return payments.p2wsh({ hash: decode.data }).output
      }
    }
  }

  throw new Error(address + ' has no matching Script')
}

module.exports = {
  fromBase58Check: fromBase58Check,
  fromBech32: fromBech32,
  fromOutputScript: fromOutputScript,
  toBase58Check: toBase58Check,
  toBech32: toBech32,
  toOutputScript: toOutputScript
}
