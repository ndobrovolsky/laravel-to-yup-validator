import String from './String'
import BaseRule from './BaseRule'

const supportedRules = [
    'string'
]

function getName(rules: string[]): string {
    for (const rule of rules) {
        if (supportedRules.includes(rule))
            return rule;
    }
    return ''
}

export default function makeRule(rules: string[]): BaseRule {
    const name = getName(rules)
    switch (name) {
        case 'string':
            return new String(rules)
        default:
            return new BaseRule(rules)
    }
}

