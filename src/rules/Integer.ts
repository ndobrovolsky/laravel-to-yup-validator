import BaseRule from './BaseRule'

export default class Integer extends BaseRule {
    protected allowedSubrules: string[] = [
        'required',
        'nullable',
        'min',
        'max',
        'length',
    ]

    public getSchema(): string {
        return 'yup.number().integer()' + this.getSubRules()
    }
}