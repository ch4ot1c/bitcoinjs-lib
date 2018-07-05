// https://en.bitcoin.it/wiki/List_of_address_prefixes
// Dogecoin BIP32 is a proposed standard: https://bitcointalk.org/index.php?topic=409731

module.exports = {
  bitcoin: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bc',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80
  },
  testnet: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'tb',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef
  },
  bitcoinprivate: {
    messagePrefix: '\x19BitcoinPrivate Signed Message:\n',
    bech32: 'p',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x1325,
    scriptHash: 0x13af,
    wif: 0x80,
    z: {
      addrVersion: [0x16, 0xa8], // zk
      skVersion: [0xab, 0x36], // SK
      vkVersion: [0xA8, 0xAB, 0xD3] // ZiVK
    }
  },
  bitcoinprivateTestnet: {
    messagePrefix: '\x19BitcoinPrivate Signed Message:\n',
    bech32: 'test',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    },
    pubKeyHash: 0x1957,
    scriptHash: 0x19e0,
    wif: 0xef,
    z: {
      addrVersion: [0x16, 0xc0], // zz
      skVersion: [0xac, 0x08], // ST
      vkVersion:[0xA8, 0xAC, 0x0C] // ZiVT
    }
  },
  zclassic: {
    messagePrefix: '\x19Zcash Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x1cb8,
    scriptHash: 0x1cbd,
    wif: 0x80,
    z: {
      addrVersion: [0x16, 0x9a],
      skVersion: [0xab, 0x36],
      vkVersion: [0xA8, 0xAB, 0xD3] // ZiVK
    }
  },
  zclassicTestnet: {
    messagePrefix: '\x19Zcash Signed Message:\n',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    },
    pubKeyHash: 0x1d25,
    scriptHash: 0x1cba,
    wif: 0xef,
    z: {
      addrVersion: [0x16, 0xb6],
      skVersion: [0xac, 0x08],
      vkVersion: [0xA8, 0xAC, 0x0C] // ZiVT
    }
  },
  zcash: {
    messagePrefix: '\x19Zcash Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x1cb8,
    scriptHash: 0x1cbd,
    wif: 0x80,
    z: {
      addrVersion: [0x16, 0x9a],
      skVersion: [0xab, 0x36],
      vkVersion: [0xA8, 0xAB, 0xD3] // ZiVK
    }
  } /* TODO ZCASH TESTNET */
}
