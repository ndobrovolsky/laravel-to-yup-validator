export interface ValidationData {
    [key: string]: string | string[]
}

export interface RuleObject {
    rules: string[]
    children: ValidationObject | null
}

export interface ValidationObject {
    [key: string]: RuleObject
}

export interface SubRule {
    name: string, args: any[]
}