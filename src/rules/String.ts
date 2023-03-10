import BaseRule from './BaseRule'

export default class String extends BaseRule {
    protected allowedSubrules: string[] = [
        'required',
        'nullable',
        'min',
        'max',
        'length',
    ]

    public getSchema(): string {
        return 'yup.string()' + this.getSubRules(this.rules)
    }
}