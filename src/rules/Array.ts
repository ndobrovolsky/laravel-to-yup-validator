import { ValidationObject } from '../interfaces'
import BaseRule from './BaseRule'
import makeRule from './index'

export default class Array extends BaseRule {
    protected type: string | null = null
    protected allowedSubrules: string[] = [
        'required',
        'nullable',
        'min',
        'max',
        'length',
    ]

    constructor(rules: string[], children: ValidationObject | null = null) {
        super(rules, children)
        if (this.children)
            this.type = Object.keys(this.children).length > 1 ? 'object' : 'array'
    }

    public getSchema(): string {
        return `yup.${this.type}()${this.getSubRules()}`
    }

    protected getSubRules(): string {
        if (this.type) {
            return this.type === 'array' ? this.getArray() : this.getObject()
        }
        return ''
    }

    protected getArray(): string {
        const childRule = makeRule(Object.values(this.children)[0])
        return `.of(${childRule.getSchema()})`
    }

    protected getObject(): string {
        let schema = ''
        for (const [name, value] of Object.entries(this.children)) {
            const rule = makeRule(value)
            schema += `'${name}': (${rule.getSchema()}),`
        }

        return `.shape({${schema}})`
    }
}