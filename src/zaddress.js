const bs58check = require('bs58check')
const crypto = require('crypto')
const networks = require('./networks')
const bcrypto = require('./crypto')
const nacl = require('tweetnacl')
const sha256 = require('./z_sha256')


// TODO ZCASH
/*
const networks = {
  zcash: { z: {
    skVersion: [0xAB, 0x36], // Guarantees the first 2 characters, when base58 encoded, are "SK"
    vkVersion: [0xA8, 0xAB, 0xD3], // Guarantees the first 4 characters, when base58 encoded, are "ZiVK"
    addrVersion: [0x16, 0x9A] } // Guarantees the first 2 characters, when base58 encoded, are "zc"
  },
  zcashTestnet: { z: {
    skVersion: [0xAC, 0x08], // Guarantees the first 2 characters, when base58 encoded, are "ST"
    vkVersion: [0xA8, 0xAC, 0x0C], // Guarantees the first 4 characters, when base58 encoded, are "ZiVt"
    addrVersion: [0x16, 0xB6] } // Guarantees the first 2 characters, when base58 encoded, are "zt"
  }
}*/

// Validates the (2 byte) prefix of the given key.
function validateKey (key) {
  if (key === undefined || key === null) {
    return false
  } else if ((key[0] & 0xf0) !== 0) {
    return false
  } else {
    return true
  }
}

// Generates the SHA256 hash of a formatted key.
function PRF (key, t) {
  if (!Buffer.isBuffer(key)) {
    throw new Error('Invalid key instance')
  }

  if (key.length < 32) {
    throw new Error('Invalid key length')
  }

  const buffer = Buffer.concat([key, Buffer.alloc(32, 0)])
  buffer[0] |= 0xc0
  buffer[32] = t

  return sha256(buffer, { noPreprocess: true, asBytes: true })
  // const c = require('crypto')
  // c.createHash('sha256').update(buffer) // Doesn't match
}

// Generates the SHA256 hash of a formatted spending key and encoded
// using the x-coordinate of the generator for Curve25519 with NaCl.
function encodedPRF (key) {
  const address = PRF(key, 1)

  return nacl.scalarMult.base(Uint8Array.from(address))
}

// Creates a spending key.
function createSpendingKey (version) {
  const buffer = crypto.randomBytes(32)
  buffer[0] &= 0x0f
  const bufferHeader = Buffer.from(version)
  return bs58check.encode(Buffer.concat([bufferHeader, buffer]))
}

function convertSpendingKeyToViewingKey (key, skVersion, vkVersion) {
  if (!validateKey(key)) {
    throw new Error('Invalid spending key')
  }

  const decode = bs58check.decode(key)
  const prefix = decode.slice(0, 2)
  const payload = decode.slice(2)

  if (!prefix[0] === skVersion[0] || prefix[1] !== skVersion[1]) {
    throw new Error('Invalid spending key version')
  }

  const keyA = PRF(payload, 0)
  const keyB = PRF(payload, 1)
  keyB[0] &= 248
  keyB[31] &= 127
  keyB[31] |= 64

  const bufferH = Buffer.from(vkVersion)
  const bufferA = Buffer.from(keyA)
  const bufferB = Buffer.from(keyB)

  const bufferViewingKey = Buffer.concat([bufferH, bufferA, bufferB])

  const viewingKey = bs58check.encode(bufferViewingKey)
  if (viewingKey.length !== 97) {
    throw new Error('Invalid viewingKey length')
  }
  return viewingKey
}

// Converts a provided spending key string to a address string.
function convertSpendingKeyToAddress (key, skVersion, addrVersion) {
  if (!validateKey(key)) {
    throw new Error('Invalid spending key')
  }

  const decode = bs58check.decode(key)
  const prefix = decode.slice(0, 2)
  const payload = decode.slice(2)

  if (!prefix[0] === skVersion[0] || prefix[1] !== skVersion[1]) {
    throw new Error('Invalid spending key version')
  }

  const addrA = PRF(payload, 0)
  const addrB = encodedPRF(payload)

  const bufferH = Buffer.from(addrVersion)
  const bufferA = Buffer.from(addrA)
  const bufferB = Buffer.from(addrB)

  const bufferAddr = Buffer.concat([bufferH, bufferA, bufferB])

  const address = bs58check.encode(bufferAddr)
  if (address.length !== 95) {
    throw new Error('Invalid address length')
  }
  return address
}

// Generates a random spending key.
function generateSpendingKey (network) {
  const zParams = network.z
  return createSpendingKey(zParams.skVersion)
}

// Generates the address associated with a given spending key.
function generateAddressFromSpendingKey (key, network) {
  const zParams = network.z
  return convertSpendingKeyToAddress(key, zParams.skVersion, zParams.addrVersion)
}

// Generates the viewing key associated with a given spending key.
function generateViewingKeyFromSpendingKey (key, network) {
  const zParams = network.z
  return convertSpendingKeyToViewingKey(key, zParams.skVersion, zParams.vkVersion)
}

// Generates a Zcash private wallet.
function generateAllFromSpendingKey (network) {
  const zParams = network.z
  const spendingKey = generateSpendingKey(network)
  const viewingKey = generateViewingKeyFromSpendingKey(spendingKey, network)
  const address = generateAddressFromSpendingKey(spendingKey, network)
  return { spendingKey: spendingKey, viewingKey: viewingKey, address: address }
}

module.exports = {
  createSpendingKey: createSpendingKey,
  convertSpendingKeyToViewingKey: convertSpendingKeyToViewingKey,
  convertSpendingKeyToAddress: convertSpendingKeyToAddress
}

module.exports = {
  generateSpendingKey: generateSpendingKey,
  generateAddressFromSpendingKey: generateAddressFromSpendingKey,
  generateViewingKeyFromSpendingKey: generateViewingKeyFromSpendingKey,
  generateAllFromSpendingKey: generateAllFromSpendingKey
}
