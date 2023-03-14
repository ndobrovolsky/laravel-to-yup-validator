import { ValidationObject, SubRule } from '../interfaces'

export default class BaseRule {
    protected rules: string[]
    protected children: ValidationObject | null = null
    protected allowedSubrules: string[] = [
        'required',
        'nullable',
    ]

    constructor(rules: string[], children: ValidationObject | null = null) {
        this.rules = rules
        this.children = children
    }

    public getSchema(): string {
        return 'yup.mixed()' + this.getSubRules()
    }

    protected getSubRules(): string {
        let subRules = ''
        for(const rule of this.rules) {
            if (rule && typeof rule === 'string') {
                const [ruleName, ruleValue] = rule.split(':')
                const subRule = this.getSubRule(ruleName, ruleValue)
                if (subRule)
                    subRules += `.${subRule.name}(${subRule.args.map(arg => `'${arg}'`).join(', ')})`
            }
        }

        return subRules
    }

    protected getSubRule(ruleName: string, ruleValue: string): SubRule | null {
        if (!this.allowedSubrules.includes(ruleName))
            return null

        switch (ruleName) {
            case 'required':
                return { name: 'required', args: [] }
            case 'min':
                return { name: 'min', args: [Number(ruleValue)] }
            case 'max':
                return { name: 'max', args: [Number(ruleValue)] }
            case 'size':
                return { name: 'test', args: [`len:${ruleValue}`, '${path} must be of size ${size}'] }
            case 'nullable':
                return { name: 'nullable', args: [] }
            default:
                return null
        }
    }
}