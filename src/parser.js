import YAML from 'yamljs';

export function parseYamlString(text) {
    return YAML.parse(text);
}

export function parseJsonString(text) {
    return JSON.parse(text);
}