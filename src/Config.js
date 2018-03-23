import _ from 'lodash';
import * as parser from './parser';

export default class Config {
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
        return `${this.prefix}${this.service}__${this.env}`
    }

    getFinalResult(format, result) {
        const fmt = format || this.format;
        if (fmt === 'yaml') {
            return parser.parseYamlString(result);
        } else {
            return parser.parseJsonString(result);
        }
    }

    async get(path, defaults, options = {}) {
        return new Promise((resolve, reject) => {
            this.consul.kv.get({...options, key: this.getFinalService(), token: this.token}, (err, result) => {
                if (err) {
                    return reject(err);
                }

                if (result) {
                    const data = this.getFinalResult(options.format, result.Value);
                    if (path) {
                        resolve(_.get(data, path, defaults));
                    } else {
                        resolve(data);
                    }
                } else {
                    resolve({});
                }
            })
        });
    }

    watch(path, defaults, callback, options = {}) {
        const watch = this.consul.watch({
            method: this.consul.kv.get,
            options: {...options, key: this.getFinalService(), token: this.token}
        });

        watch.on('change', (result, res) => {
            if (typeof callback === 'function') {

                if (result) {
                    const data = this.getFinalService(options.format, result.Value);
                    if (path) {
                        callback(null, _.get(data, path, defaults), res);
                    } else {
                        callback(null, data, res);
                    }
                } else {
                    callback(null, {}, res);
                }
            }
        });

        watch.on('error', err => {
            if (typeof callback === 'function') {
                callback(err);
            }
        })
    }
}