'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// const EthQuery = require('ethjs-query')
var EthQuery = require('eth-query');
var AsyncEventEmitter = require('async-eventemitter');
var pify = require('pify');
var incrementHexNumber = require('./lib/hexUtils').incrementHexNumber;

var RpcBlockTracker = function (_AsyncEventEmitter) {
  _inherits(RpcBlockTracker, _AsyncEventEmitter);

  function RpcBlockTracker() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, RpcBlockTracker);

    var _this = _possibleConstructorReturn(this, (RpcBlockTracker.__proto__ || Object.getPrototypeOf(RpcBlockTracker)).call(this));

    if (!opts.provider) throw new Error('RpcBlockTracker - no provider specified.');
    _this._query = new EthQuery(opts.provider);
    // config
    _this._pollingInterval = opts.pollingInterval || 800;
    // state
    _this._trackingBlock = null;
    _this._currentBlock = null;
    _this._isRunning = false;
    // bind methods for cleaner syntax later
    _this.emit = _this.emit.bind(_this);
    _this._performSync = _this._performSync.bind(_this);
    return _this;
  }

  _createClass(RpcBlockTracker, [{
    key: 'getTrackingBlock',
    value: function getTrackingBlock() {
      return this._trackingBlock;
    }
  }, {
    key: 'getCurrentBlock',
    value: function getCurrentBlock() {
      return this._currentBlock;
    }
  }, {
    key: 'start',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this._isRunning) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return');

              case 2:
                this._isRunning = true;
                // if this._currentBlock

                if (!opts.fromBlock) {
                  _context.next = 12;
                  break;
                }

                _context.t0 = this;
                _context.next = 7;
                return this._fetchBlockByNumber(opts.fromBlock);

              case 7:
                _context.t1 = _context.sent;
                _context.next = 10;
                return _context.t0._setTrackingBlock.call(_context.t0, _context.t1);

              case 10:
                _context.next = 18;
                break;

              case 12:
                _context.t2 = this;
                _context.next = 15;
                return this._fetchLatestBlock();

              case 15:
                _context.t3 = _context.sent;
                _context.next = 18;
                return _context.t2._setTrackingBlock.call(_context.t2, _context.t3);

              case 18:
                this._performSync().catch(function (err) {
                  if (err) console.error(err);
                });

              case 19:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function start() {
        return _ref.apply(this, arguments);
      }

      return start;
    }()
  }, {
    key: 'stop',
    value: function stop() {
      this._isRunning = false;
    }

    //
    // private
    //

  }, {
    key: '_setTrackingBlock',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(newBlock) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(this._trackingBlock && this._trackingBlock.hash === newBlock.hash)) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt('return');

              case 2:
                this._trackingBlock = newBlock;
                _context2.next = 5;
                return pify(this.emit)('block', newBlock);

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _setTrackingBlock(_x3) {
        return _ref2.apply(this, arguments);
      }

      return _setTrackingBlock;
    }()
  }, {
    key: '_setCurrentBlock',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(newBlock) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(this._currentBlock && this._currentBlock.hash === newBlock.hash)) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt('return');

              case 2:
                this._currentBlock = newBlock;
                _context3.next = 5;
                return pify(this.emit)('latest', newBlock);

              case 5:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function _setCurrentBlock(_x4) {
        return _ref3.apply(this, arguments);
      }

      return _setCurrentBlock;
    }()
  }, {
    key: '_pollForNextBlock',
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                setTimeout(function () {
                  return _this2._performSync();
                }, this._pollingInterval);

              case 1:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function _pollForNextBlock() {
        return _ref4.apply(this, arguments);
      }

      return _pollForNextBlock;
    }()
  }, {
    key: '_performSync',
    value: function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        var trackingBlock, nextNumber, newBlock;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (this._isRunning) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt('return');

              case 2:
                trackingBlock = this.getTrackingBlock();

                if (trackingBlock) {
                  _context5.next = 5;
                  break;
                }

                throw new Error('RpcBlockTracker - tracking block is missing');

              case 5:
                nextNumber = incrementHexNumber(trackingBlock.number);
                _context5.prev = 6;
                _context5.next = 9;
                return this._fetchBlockByNumber(nextNumber);

              case 9:
                newBlock = _context5.sent;

                if (!newBlock) {
                  _context5.next = 16;
                  break;
                }

                _context5.next = 13;
                return this._setTrackingBlock(newBlock);

              case 13:
                // ask for next block
                this._performSync();
                _context5.next = 19;
                break;

              case 16:
                _context5.next = 18;
                return this._setCurrentBlock(trackingBlock);

              case 18:
                // setup poll for next block
                this._pollForNextBlock();

              case 19:
                _context5.next = 24;
                break;

              case 21:
                _context5.prev = 21;
                _context5.t0 = _context5['catch'](6);

                if (_context5.t0) console.error(_context5.t0);

              case 24:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[6, 21]]);
      }));

      function _performSync() {
        return _ref5.apply(this, arguments);
      }

      return _performSync;
    }()
  }, {
    key: '_fetchLatestBlock',
    value: function _fetchLatestBlock() {
      return pify(this._query.getBlockByNumber).call(this._query, 'latest', false);
    }
  }, {
    key: '_fetchBlockByNumber',
    value: function _fetchBlockByNumber(hexNumber) {
      return pify(this._query.getBlockByNumber).call(this._query, hexNumber, false);
    }
  }]);

  return RpcBlockTracker;
}(AsyncEventEmitter);

module.exports = RpcBlockTracker;

// ├─ difficulty: 0x2892ddca
// ├─ extraData: 0xd983010507846765746887676f312e372e348777696e646f7773
// ├─ gasLimit: 0x47e7c4
// ├─ gasUsed: 0x6384
// ├─ hash: 0xf60903687b1559b9c80f2d935b4c4f468ad95c3076928c432ec34f2ef3d4eec9
// ├─ logsBloom: 0x00000000000000000000000000000000000000000000000000000000000020000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000
// ├─ miner: 0x01711853335f857442ef6f349b2467c531731318
// ├─ mixHash: 0xf0d9bec999600eec92e8e4da8fc1182e357468c9ed2f849aa17e0e900412b352
// ├─ nonce: 0xd556d5a5504198e4
// ├─ number: 0x72ac8
// ├─ parentHash: 0xf5239c3ce1085194521435a5052494c02bbb1002b019684dcf368490ea6208e5
// ├─ receiptsRoot: 0x78c6f8236094b392bcc43b47b0dc1ce93ecd2875bfb5e4e4c3431e5af698ff99
// ├─ sha3Uncles: 0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347
// ├─ size: 0x2ad
// ├─ stateRoot: 0x0554f145c481df2fa02ecd2da17071672740c3aa948c896f1465e6772f741ac6
// ├─ timestamp: 0x58955844
// ├─ totalDifficulty: 0x751d0dfa03c1
// ├─ transactions
// │  └─ 0
// │     ├─ blockHash: 0xf60903687b1559b9c80f2d935b4c4f468ad95c3076928c432ec34f2ef3d4eec9
// │     ├─ blockNumber: 0x72ac8
// │     ├─ from: 0x201354729f8d0f8b64e9a0c353c672c6a66b3857
// │     ├─ gas: 0x15f90
// │     ├─ gasPrice: 0x4a817c800
// │     ├─ hash: 0xd5a15d7c2449150db4f74f42a6ca0702150a24c46c5b406a7e1b3e44908ef44d
// │     ├─ input: 0xe1fa8e849bc10d87fb03c6b0603b05a3e29043c7e0b7c927119576a4bec457e96c7d7cde
// │     ├─ nonce: 0x323e
// │     ├─ to: 0xd10e3be2bc8f959bc8c41cf65f60de721cf89adf
// │     ├─ transactionIndex: 0x0
// │     ├─ value: 0x0
// │     ├─ v: 0x29
// │     ├─ r: 0xf35f8ab241e6bb3ccaffd21b268dbfc7fcb5df1c1fb83ee5306207e4a1a3e954
// │     └─ s: 0x1610cdac2782c91065fd43584cd8974f7f3b4e6d46a2aafe7b101788285bf3f2
// ├─ transactionsRoot: 0xb090c32d840dec1e9752719f21bbae4a73e58333aecb89bc3b8ed559fb2712a3
// └─ uncles