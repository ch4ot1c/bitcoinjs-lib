/* global describe, it */

const assert = require('assert')
//const fixtures = require('./fixtures/z_address.json')
const zaddress = require('../src/z_address')

const networks = require('../src/networks')

// TODO move into fixtures
// Generated using zcashd v1.0.14-RC1.
const zcashMainnetFixtures = [
  {
    network: 'zcash',
    spendingKey: 'SKxss2BvgfLjKCmrWNdGdG3B9ZHhQf2L1kGsQB34uykWeYRHgaDN',
    viewingKey: 'ZiVKcXfY5nvfyuijKM3UyqnXx5ymCnp7ndgcTg1je5fJutsYxKiUousgH4TP2vY2pMBK594X91vdiFH8gR41gTjutR1ycsuzW',
    address: 'zcNStB2sLnxPUTsg6aCSSQFdutcrp1a816m848ngoYLUa6kRTC3uZMWAhHnCU6bPtYyYGSw4HFFgDS2u6pwv41cx8BBgy8u'
  },
  {
    network: 'zcash',
    spendingKey: 'SKxtYkM8R8X8eAvKJLyckV5Gero9SaHMDDSq3Z54opLi3NjPJZCq',
    viewingKey: 'ZiVKsSgutqkoyzZi1MvWvBwNYFdKsUGBdQ3pCNFS1SebacucPqmaJvMYLgBU3c3ybMa1FFeVsCmZnQB743vF2wk93AHQrWVcB',
    address: 'zcdMuYqvAvxUKSZgyc8nbEqoZTHYG5QtNJVpHqA3nq1CcAiWo2QNTMBQoAXcD64AAhF39KdLkNP61xw9Afw2GFq5nHpQE7n'
  },
  {
    network: 'zcash',
    spendingKey: 'SKxsPUTCPExBhPo9aBXXDpnwq2B53dD6rMAZuHRSpGA89mvvDoZ5',
    viewingKey: 'ZiVKYjyTf7Zu7mQs2gnvXy8NRm9orGZTdtNGV2usUuxRNzcP6AwcQRXppYbEW8sGUxv6DQ9CXjMKubk7nA7EmZdgkaSuTCvas',
    address: 'zcJfC6cBz26FAbb1r1kZnEjK5wGLZMRNgknUxGdX6eoaJuu8JNFDi4avFQG5a8vMCgJyr6V8wP5kumvrwcqwxPJytTSAo36'
  }
]

describe('z-addresses', function () {

  let zcl = networks['zclassic']
  let zclT = networks['zclassicTestnet']

  it('generateSpendingKey', function () {
    const mainnetSpendingKey = zaddress.generateSpendingKey(zcl)
    assert.equal(mainnetSpendingKey.slice(0, 2), 'SK')

    const testnetSpendingKey = zaddress.generateSpendingKey(zclT)
    assert.equal(testnetSpendingKey.slice(0, 2), 'ST')
  })

  it('generateViewingKeyFromSpendingKey', function () {
    const mainnetSpendingKey = zaddress.generateSpendingKey(zcl)
    const mainnetViewingKey = zaddress.generateViewingKeyFromSpendingKey(mainnetSpendingKey, zcl)
    assert.equal(mainnetViewingKey.slice(0, 4), 'ZiVK')

    const testnetSpendingKey = zaddress.generateSpendingKey(zclT)
    const testnetViewingKey = zaddress.generateViewingKeyFromSpendingKey(testnetSpendingKey, zclT)
    assert.equal(testnetViewingKey.slice(0, 4), 'ZiVt')
  })

  it('generateAddressFromSpendingKey', function () {
    const mainnetSpendingKey = zaddress.generateSpendingKey(zcl)
    const mainnetAddress = zaddress.generateAddressFromSpendingKey(mainnetSpendingKey, zcl)
    assert.equal(mainnetAddress.slice(0, 2), 'zc')

    const testnetSpendingKey = zaddress.generateSpendingKey(zclT)
    const testnetAddress = zaddress.generateAddressFromSpendingKey(testnetSpendingKey, zclT)
    assert.equal(testnetAddress.slice(0, 2), 'zt')
  })

  it('generateAllFromSpendingKey', function () {
    const mainnetWallet = zaddress.generateAllFromSpendingKey(zcl)
    assert.equal(mainnetWallet.spendingKey.slice(0, 2), 'SK')
    assert.equal(mainnetWallet.address.slice(0, 2), 'zc')

    const testnetWallet = zaddress.generateAllFromSpendingKey(zclT)
    assert.equal(testnetWallet.spendingKey.slice(0, 2), 'ST')
    assert.equal(testnetWallet.address.slice(0, 2), 'zt')
  })

  zcashMainnetFixtures.forEach(function (pair, index) {
    it('generateViewingKeyFromSpendingKey' + index, function () {
      const viewingKey = zaddress.generateViewingKeyFromSpendingKey(pair.spendingKey, networks[pair.network])
      assert.equal(viewingKey, pair.viewingKey)
    })

    it('generateAddressFromSpendingKey' + index, function () {
      const address = zaddress.generateAddressFromSpendingKey(pair.spendingKey, networks[pair.network])
      assert.equal(address.slice(0, 2), 'zc')
      assert.equal(address, pair.address)
    })
  })
})
