import { RuleObject, ValidationObject } from '../interfaces'
import String from './String'
import Number from './Number'
import Integer from './Integer'
import Boolean from './Boolean'
import BaseRule from './BaseRule'
import Array from './Array'

const ruleClasses = {
    'string': String,
    'numeric': Number,
    'integer': Integer,
    'boolean': Boolean,
}

function getRuleInstance(rules: string[]): BaseRule {
    for (const rule of rules) {
        if (Object.keys(ruleClasses).includes(rule))
            return new ruleClasses[rule](rules);
    }
    return new BaseRule(rules)
}

export default function makeRule(rule: RuleObject): BaseRule {
    const rules = rule.rules
    const children = rule.children
    if(children && Object.keys(children).length > 0) return new Array(rules, children)
    
    return getRuleInstance(rules)
}

