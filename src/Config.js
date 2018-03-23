import * as parser from './parser';

export default class Config {
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
        return `${this.prefix}${service}__${env}`
    }

    getFinalResult(format, result) {
        const fmt = format || this.format;
        if (fmt === 'yaml') {
            return parser.parseYamlString(result);
        } else {
            return parser.parseJsonString(result);
        }
    }

    async get(service, env, options = {}) {
        return new Promise((resolve, reject) => {
            this.consul.kv.get({...options, key: this.getFinalService(service, env)}, (err, result) => {
                if (err) {
                    return reject(err);
                }

                resolve(this.getFinalResult(options.format, result));
            })
        });
    }

    watch(service, env, callback, options = {}) {
        const watch = this.consul.watch({
            method: this.consul.kv.get,
            options: {...options, key: this.getFinalService(service, env)}
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
        })
    }
}