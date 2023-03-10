import * as yup from 'yup'

export const Test2 = yup.object({
	'val-string': yup.string().required().min('3').max('5'),
	'val-integer': yup.mixed().required(),
	'val-boolean': yup.mixed().required(),
	'custom': yup.string().required(),
})
export const Test = yup.object({
	'val-string': yup.string().required().min('3').max('5'),
	'val-integer': yup.mixed().required(),
	'val-boolean': yup.mixed().required(),
})
