import { RuleObject, ValidationObject } from '../interfaces'
import String from './String'
import Number from './Number'
import Integer from './Integer'
import BaseRule from './BaseRule'
import Array from './Array'

const supportedRules = [
    'string',
    'numeric',
    'integer',
    'array',
]

function getName(rules: string[]): string {
    for (const rule of rules) {
        if (supportedRules.includes(rule))
            return rule;
    }
    return ''
}

export default function makeRule(rule: RuleObject): BaseRule {
    const rules = rule.rules
    const children = rule.children
    if(children && Object.keys(children).length > 0) return new Array(rules, children)
    
    const name = getName(rules)
    switch (name) {
        case 'string':
            return new String(rules)
        case 'numeric':
            return new Number(rules)
        case 'integer':
            return new Integer(rules)
        default:
            return new BaseRule(rules)
    }
}

