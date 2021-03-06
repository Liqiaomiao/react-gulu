import { FormValue } from "./form";

interface FormRule {
    key: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    validator?: (value: string) => Promise<string>
}

type FormRules = Array<FormRule>

interface ErrorValue {
    [K: string]: string[]
}

type ErrorInfo = string | Promise<string>
const isEmpty = (whatever: any) => {
    return whatever === '' || whatever === undefined || whatever === null
}
export const noError = (errors: ErrorValue) => {
    return Object.keys(errors).length === 0
}
const Validator = (formData: FormValue, rules: FormRules, callback: (errors: ErrorValue) => void): void => {
    let errors: { [K: string]: ErrorInfo[] } = {}
    const addRule = (key: string, errorInfo: ErrorInfo) => {
        if (!errors[key]) {
            errors[key] = []
        }
        errors[key].push(errorInfo)


    }
    rules.map(rule => {
        const value = formData[rule.key]
        if (rule.validator) {
            const promise = rule.validator(value)
            addRule(rule.key, promise)
        }
        if (isEmpty(value) && rule.required) {
            addRule(rule.key, 'required')
        }
        if (!isEmpty(value) && rule.minLength && value.length < rule.minLength) {
            addRule(rule.key, `minLength`)
        }
        if (!isEmpty(value) && rule.maxLength && value.length > rule.maxLength) {
            addRule(rule.key, `maxLength`)
        }
        if (rule.pattern && !(rule.pattern.test(value))) {
            addRule(rule.key, `pattern`)
        }
    })
    const flattenErrors = flat(Object.keys(errors).map(key =>
        errors[key].map<[string, ErrorInfo]>((error) =>
            [key, error]
        )
    ))
    const newPromise = flattenErrors.map(([key, error]) =>
        (error instanceof Promise ? error : Promise.reject(error)) // 如果不是promise转成pormise => Promise.reject(error)
            .then<[string, undefined], [string, string]>(() => {
                return [key, undefined]
            }, (reason: string) => {
                return [key, reason]
            })
    )
    // https://github.com/Microsoft/TypeScript/issues/20218
    function hasError(item: [string, string] | [string, undefined]): item is [string, string] {
        return item[1] !== undefined
    }
    Promise.all(newPromise).then(results => {
        callback(zip(results.filter<[string, string]>(hasError)))
    })

}

function flat<T>(array: Array<T | T[]>) {
    const result = []
    for (var i = 0; i < array.length; i++) {
        if (array[i] instanceof Array) {
            result.push(...array[i] as T[])
        } else {
            result.push(array[i] as T)
        }
    }
    return result
}

function zip(arr: Array<[string, string]>) {
    let result: ErrorValue = {}
    arr.map(([key, value]) => {
        result[key] = result[key] || []
        result[key].push(value)
    })
    return result
}


export default Validator