
import makeRule from './rules/'
import { ValidationData, ValidationObject } from './interfaces'

export default class Converter {
    public convert(data: ValidationData): string {
        let rulesParsed = this.parse(data)
        return this.createSchema(rulesParsed)
    }

    private parse(data: ValidationData): ValidationObject {
        let parsed = {}

        for (const [name, value] of Object.entries(data)) {
            if(name === 'options.*.body'){
                console.log(name)
            }
            const rules = this.ruleToArray(value).filter((rule) => typeof rule === 'string')
            const nameParts = name.split('.')
            try{
                parsed = this.buildValidationObject(nameParts, rules, parsed)
            } catch (e) {
                console.log(e)
            }
        }

        return parsed
    }

    private ruleToArray(name: string | string[] ): string[] {
        if (typeof name === 'string')
            return name.split('|')
        else
            return name
    }

    private buildValidationObject(nameParts: string[], rules: string[], acc: ValidationObject = {}) {
        const name = nameParts.shift()
        if (!acc || !acc[name]) {
            acc = this.makeEmptyValidationObject(name, acc || {})
        }

        if (nameParts.length > 0) {
            acc[name].children = this.buildValidationObject(nameParts, rules, acc[name].children)
        } else {
            rules.forEach((rule, index) => {
                if (rule.includes('array')) {
                    const ruleParts = rule.split(':')
                    const ruleName = ruleParts[0]
                    const childRules = ruleParts[1] ? ruleParts[1].split(',') : []
                    acc[name].children = {}
                    childRules.forEach((childRule) => {
                        acc[name].children = this.makeEmptyValidationObject(childRule.trim(), acc[name].children)
                    })
                    rules[index] = ruleName
                    return acc
                }
            })
            acc[name].rules = rules
        }

        return acc
    }

    private makeEmptyValidationObject(
        name: string, 
        object: ValidationObject = {}, 
        rules: string[] | null = [], 
        children: ValidationObject | null = null
    ): ValidationObject {
        
        object[name] = {
            rules,
            children
        }
        return object
    }

    private createSchema(data: ValidationObject): string {
        const shape = Object.entries(data).reduce((acc, [name, value]) => {
            acc += `\n\t'${name}': ${makeRule(value).getSchema()},`
            return acc
        }, '')
    
        return `yup.object({${shape}\n})`
    }

}