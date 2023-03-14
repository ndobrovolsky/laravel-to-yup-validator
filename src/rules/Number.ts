import BaseRule from './BaseRule'

export default class Number extends BaseRule {
    protected allowedSubrules: string[] = [
        'required',
        'nullable',
        'min',
        'max',
        'length',
    ]

    public getSchema(): string {
        return 'yup.number()' + this.getSubRules()
    }
}