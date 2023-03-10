import BaseRule from './BaseRule'

export default class String extends BaseRule {
    protected allowedSubrules: string[] = [
        'required',
        'nullable',
        'min',
        'max',
        'length',
        'in',
        'not_in',
        'email',
    ]

    public getSchema(): string {
        return 'yup.string()' + this.getSubRules()
    }
}