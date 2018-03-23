'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseYamlString = parseYamlString;
exports.parseJsonString = parseJsonString;

var _yamljs = require('yamljs');

var _yamljs2 = _interopRequireDefault(_yamljs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseYamlString(text) {
    return _yamljs2.default.parse(text);
}

function parseJsonString(text) {
    return JSON.parse(text);
}