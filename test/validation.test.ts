import * as yup from 'yup'

const types = {
    'string': yup.string,
    'number': yup.number,
    'integer': yup.number,
    'boolean': yup.boolean,
    'date': yup.date,
    'array': yup.array,
    'object': yup.object,
    'mixed': yup.mixed,
}

function createSchema(items) {

    let shape = Object.keys(items).reduce((acc, name) => {
        acc[name] = buildSchemaLeaf(items[name])
        return acc
    }, {})

    return yup.object().shape(shape)
}

function buildSchemaLeaf(item) {
    let rules = item.rules
    let children = item.children

    if (!rules) {
        var rule = buildRule(['mixed'])
    } else {
        var rule = buildRule(rules)
    }

    if (children) {
        let childrenKeys = Object.keys(children)
        let childrenValues = Object.values(children)
        if (childrenKeys.length > 1) {
            rule.type = 'object'
            rule.shape = childrenKeys.reduce((acc, name) => {
                acc[name] = buildSchemaLeaf(children[name])
                return acc
            }, {})
        } else {
            rule.type = 'array'
            rule.of = buildSchemaLeaf(childrenValues[0])
        }
    }

    return getType(rule)
}

function parseRules(rules) {
    let rulesObject = rules.reduce((acc, item) => {
        let nameParts = item.name.split('.')
        acc = buildRulesObject(nameParts, item.rules, acc)
        return acc
    }, {})

    return rulesObject
}

function buildRulesObject(nameParts, rules, children = {}) {
    let name = nameParts.shift()
    if (!children[name]) {
        children[name] = {}
    }

    if (nameParts.length > 0) {
        children[name].children = buildRulesObject(nameParts, rules, children[name].children)
    } else {
        rules.forEach((rule, index) => {
            if(rule.includes('array')) {
                let ruleSplit = rule.split(':')
                let ruleName = ruleSplit[0]
                let childRules = ruleSplit[1] ? ruleSplit[1].split(',') : []
                children[name].children = {}
                childRules.forEach((childRule) => {
                    children[name].children[childRule.trim()] = { rules: null }
                })
                rules[index] = ruleName
                return children
            }
        })
        children[name].rules = rules
    }

    return children
}

function buildRule(rules): any {
    var newRule = {
        type: 'string',
        required: false,
        nullable: true
    }

    rules.forEach(rule => {
        if (types[rule]) {
            newRule.type = rule
        } else if (rule === 'required') {
            newRule.required = true
            newRule.nullable = false
        } else if (rule === 'nullable') {
            newRule.nullable = true
        }
    })

    return newRule
}

function getType(rule) {
    let type = types[rule.type]()

    if (rule.type == 'object' && rule.shape) {
        type = type.shape(rule.shape)
    } else if (rule.type == 'array' && rule.of) {
        type = type.of(rule.of)
    }

    if (rule.required) {
        type = type.required()
    } else if (rule.nullable) {
        type = type.nullable()
    }
    return type
}


it('test validator', async () => {
    let rules = [
       /*  { name: 'val-string', rules: ['required', 'string', 'min:3', 'max:5'] },
        { name: 'val-integer', rules: ['required', 'integer', 'size:1'] },
        { name: 'val-boolean', rules: ['required', 'boolean'] },
        { name: 'val-array', rules: ['required', 'array'] },
        { name: 'val-array.*.attr-1', rules: ['integer'] },
        { name: 'val-array.*.attr-2', rules: ['string'] }, */

        { name: 'val-array-2', rules: ['required', 'array:attr-1, attr-2'] },

        { name: 'val-object', rules: ['required', 'array'] },
        { name: 'val-object.object-integer', rules: ['integer'] },
        { name: 'val-object.object-string', rules: ['string'] },
    ]

    let rulesParsed = parseRules(rules)
    let schema = createSchema(rulesParsed)
})

