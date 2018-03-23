'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _parser = require('./parser');

var parser = _interopRequireWildcard(_parser);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let Config = class Config {
    /**
     *
     * @param consul consul instance
     * @param options
     * @param options.format
     */
    constructor(consul, options = {}) {
        this.prefix = 'config__';
        this.consul = consul;

        this.format = options.format || 'yaml';
    }

    getFinalService(service, env) {
        return `${this.prefix}${service}__${env}`;
    }

    getFinalResult(format, result) {
        const fmt = format || this.format;
        if (fmt === 'yaml') {
            return parser.parseYamlString(result);
        } else {
            return parser.parseJsonString(result);
        }
    }

    get(service, env, options = {}) {
        var _this = this;

        return _asyncToGenerator(function* () {
            return new Promise(function (resolve, reject) {
                _this.consul.kv.get(_extends({}, options, { key: _this.getFinalService(service, env) }), function (err, result) {
                    if (err) {
                        return reject(err);
                    }

                    resolve(_this.getFinalResult(options.format, result));
                });
            });
        })();
    }

    watch(service, env, options = {}, callback) {
        const watch = this.consul.watch({
            method: this.consul.kv.get,
            options: _extends({}, options, { key: this.getFinalService(service, env) })
        });

        watch.on('change', (data, res) => {
            if (typeof callback === 'function') {
                callback(null, this.getFinalService(options.format, data), res);
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