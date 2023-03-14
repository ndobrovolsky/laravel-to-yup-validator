<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'val-string' => 'required|string|min:3|max:5',
            'val-integer' => 'required|integer|size:1',
            'val-boolean' => 'required|boolean',
            'val-array' => 'required|array',
            'val-array.*' => 'required|string',
            'val-object' => 'array:attr-1, attr-2|required',
            'val-object-2' => 'array',
            'val-object-2.attr-1' => 'string',
            'val-object-2.attr-2' => 'integer',
            /* 'array' => 'required|array',
            'date' => 'required|date',
            'email' => 'required|email',
            'file' => 'required|file',
            'image' => 'required|image',
            'numeric' => 'required|numeric',
            'url' => 'required|url',
            'ip' => 'required|ip',
            'json' => 'required|json',
            'active_url' => 'required|active_url',
            'alpha' => 'required|alpha',
            'alpha_dash' => 'required|alpha_dash',
            'alpha_num' => 'required|alpha_num',
            'confirmed' => 'required|confirmed',
            'date_equals' => 'required|date_equals:2021-01-01',
            'date_format' => 'required|date_format:Y-m-d',
            'different' => 'required|different:another_field',
            'digits' => 'required|digits:4',
            'digits_between' => 'required|digits_between:4,6',
            'dimensions' => 'required|dimensions:min_width=100,min_height=200',
            'distinct' => 'required|distinct',
            'ends_with' => 'required|ends_with:jpg,png,gif',
            'exists' => 'required|exists:table,column',
            'gt' => 'required|gt:another_field',
            'gte' => 'required|gte:another_field',
            'in' => 'required|in:foo,bar,baz',
            'in_array' => 'required|in_array:another_field',
            'integer' => 'required|integer',
            'ip' => 'required|ip',
            'ipv4' => 'required|ipv4',
            'ipv6' => 'required|ipv6',
            'json' => 'required|json',
            'lt' => 'required|lt:another_field',
            'lte' => 'required|lte:another_field',
            'max' => 'required|max:255',
            'mimes' => 'required|mimes:jpg,png,gif',
            'mimetypes' => 'required|mimetypes:application/json',
            'min' => 'required|min:6',
            'not_in' => 'required|not_in:foo,bar,baz',
            'not_regex' => 'required|not_regex:/foo/',
            'nullable' => 'required|nullable',
            'numeric' => 'required|numeric',
            'present' => 'required|present',
            'regex' => 'required|regex:/foo/',
            'required' => 'required|required',
            'required_if' => 'required|required_if:another_field,value',
            'required_unless' => 'required|required_unless:another_field,value', */
        ];
    }
}
