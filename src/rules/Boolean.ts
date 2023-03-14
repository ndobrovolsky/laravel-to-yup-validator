import BaseRule from './BaseRule'

export default class Boolean extends BaseRule {
    protected allowedSubrules: string[] = []

    public getSchema(): string {
        return 'yup.boolean()' + this.getSubRules()
    }
}