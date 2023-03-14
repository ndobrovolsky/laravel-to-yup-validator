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
        { name: 'body', rules: ['required', 'string'] },
        { name: 'type', rules: ['required', 'string', 'in:select, true_false, matching'] },
        { name: 'question_category_id', rules: ['nullable', 'integer', 'exists:question_categories,id'] },
        { name: 'test_id', rules: ['nullable', 'integer', 'exists:tests,id'] },
        { name: 'settings', rules: ['required', 'array'] },
        { name: 'settings.points', rules: ['required', 'integer'] },
        { name: 'settings.numeration_style', rules: ['required', 'string', 'in:roman,alphabet,decimal,none'] },
        { name: 'settings.shuffle_options', rules: ['nullable', 'boolean'] },
        { name: 'settings.shuffle_level', rules: ['nullable', 'string', 'in:matches,clues,full'] },
        { name: 'settings.multiple_select', rules: ['nullable', 'boolean'] },
        { name: 'settings.grading_scale', rules: ['nullable', 'string', 'in:deduction, no_deduction'] },
        { name: 'options', rules: ['required', 'array'] },
        { name: 'options.*.body', rules: ['required', 'string'] },
        { name: 'options.*.is_correct', rules: ['nullable', 'boolean'] },
        { name: 'options.*.matching_option', rules: ['nullable', 'string'] },
    ]

    let rulesParsed = parseRules(rules)
    let schema = createSchema(rulesParsed)
})

