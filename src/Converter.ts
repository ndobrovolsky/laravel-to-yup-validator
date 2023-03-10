
import makeRule from './rules/'

export default class Converter {
    public convert(validationData: {[key: string]: string | string[]}): string {
        let shape = ''

        for (const [key, value] of Object.entries(validationData)) {
            const rules = this.parseRules(value)
            const rule = makeRule(rules)
            shape += `\n\t'${key}': ${rule.getSchema()},`
        }

        return `yup.object({${shape}\n})`
    }

    private parseRules(value: string | string[]): string[] {
        if (typeof value === 'string')
            return value.split('|')
        else
            return value
    }
}