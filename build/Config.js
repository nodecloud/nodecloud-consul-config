'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _parser = require('./parser');

var parser = _interopRequireWildcard(_parser);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let Config = class Config {
    /**
     *
     * @param consul consul instance
     * @param service
     * @param env
     * @param options
     * @param options.prefix
     * @param options.format
     * @param options.token
     */
    constructor(consul, service, env, options = {}) {
        this.prefix = options.prefix || 'config__';
        this.consul = consul;

        this.env = env || 'development';
        this.service = service || 'default';
        this.format = options.format || 'yaml';
        this.token = options.token;
    }

    getFinalService() {
        return `${this.prefix}${this.service}__${this.env}`;
    }

    getFinalResult(format, result) {
        const fmt = format || this.format;
        if (fmt === 'yaml') {
            return parser.parseYamlString(result);
        } else {
            return parser.parseJsonString(result);
        }
    }

    get(path, defaults, options = {}) {
        var _this = this;

        return _asyncToGenerator(function* () {
            return new Promise(function (resolve, reject) {
                _this.consul.kv.get(_extends({}, options, { key: _this.getFinalService(), token: _this.token }), function (err, result) {
                    if (err) {
                        return reject(err);
                    }

                    if (result) {
                        const data = _this.getFinalResult(options.format, result);
                        resolve(_lodash2.default.get(data, path, defaults));
                    } else {
                        resolve({});
                    }
                });
            });
        })();
    }

    watch(path, defaults, callback, options = {}) {
        const watch = this.consul.watch({
            method: this.consul.kv.get,
            options: _extends({}, options, { key: this.getFinalService(), token: this.token })
        });

        watch.on('change', (result, res) => {
            if (typeof callback === 'function') {

                if (result) {
                    const data = this.getFinalService(options.format, result);
                    callback(null, _lodash2.default.get(data, path, defaults), res);
                } else {
                    callback(null, {}, res);
                }
            }
        });

        watch.on('error', err => {
            if (typeof callback === 'function') {
                callback(err);
            }
        });
    }
};
exports.default = Config;