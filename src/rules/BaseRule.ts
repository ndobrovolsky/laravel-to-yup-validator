interface SubRule {
    name: string, args: any[]
}

export default class BaseRule {
    protected rules: string[]
    protected allowedSubrules: string[] = [
        'required',
        'nullable',
    ]

    constructor(rules: string[]) {
        this.rules = rules
    }

    public getSchema(): string {
        return 'yup.mixed()' + this.getSubRules(this.rules)
    }

    protected getSubRules(rules: string[]): string {
        let subRules = ''
        for(const rule of rules) {
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
            default:
                return null
        }
    }
}