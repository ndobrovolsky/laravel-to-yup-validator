import Converter from '../src/Converter';
import Loader from '../src/Loader';

/* it('convert string validation rules to yup', async () => {
    const validationData = {
        'val-string': 'required|string|min:3|max:5',
        'val-integer': 'required|integer|size:1',
        'val-boolean': 'required|boolean',
      };
      
      const converter = new Converter(validationData);
      const validationSchema = converter.convert();
      
});

it('convert array validation rules to yup', async () => {
    const validationData = {
        'val-string': ['required', 'string', 'min:3', 'max:5'],
        'val-integer': ['required', 'integer', 'size:1'],
        'val-boolean': ['required', 'boolean'],
      };
      
      const converter = new Converter(validationData);
      const validationSchema = converter.convert();
      
}); */

/* it('creates a file for each requests', async () => {
    const requestsPath = __dirname + '/fixtures/requests/';
    const loader = new Loader(requestsPath);
    const requests = await loader.load();

    for (const key of Object.keys(requests)) {
        const request = requests[key];
        const converter = new Converter(request);
        const validationSchema = converter.convert();
    }
}); */

/* it('includes .php requests file in subdirectory in .json', () => {
    const requestsPath = __dirname + '/fixtures/requests/';
    const files = generateFiles(requestsPath, parseAll(requestsPath));
    const requestsEn = JSON.parse(fs.readFileSync(requestsPath + files[0].name).toString());

    expect(requestsEn['domain.user.sub_dir_support_is_amazing']).toBe('Subdirectory support is amazing');
    expect(requestsEn['domain.car.is_electric']).toBe('Electric');
    expect(requestsEn['domain.car.foo.level1.level2']).toBe('barpt');
});

it('includes .php requests file in nested subdirectory in .json', () => {
    const requestsPath = __dirname + '/fixtures/requests/';
    const files = generateFiles(requestsPath, parseAll(requestsPath));
    const requestsEn = JSON.parse(fs.readFileSync(requestsPath + files[0].name).toString())

    expect(requestsEn['nested.cars.car.is_electric']).toBe('Electric');
    expect(requestsEn['nested.cars.car.foo.level1.level2']).toBe('barpt');
})

it('transforms .php requests to .json', () => {
    const requests = parse(fs.readFileSync(__dirname + '/fixtures/requests/en/auth.php').toString());

    expect(requests['failed']).toBe('These credentials do not match our records.');
});

it('transform nested .php requests files to .json', () => {
    const requestsPt = parse(fs.readFileSync(__dirname + '/fixtures/requests/pt/auth.php').toString());
    expect(requestsPt['foo.level1.level2']).toBe('barpt');

    const requestsEn = parse(fs.readFileSync(__dirname + '/fixtures/requests/en/auth.php').toString());
    expect(requestsEn['foo.level1.level2']).toBe('baren');
});

it('transforms simple index array to .json', () => {
    const requests = parse(fs.readFileSync(__dirname + '/fixtures/requests/en/auth.php').toString());
    expect(requests['arr.0']).toBe('foo');
    expect(requests['arr.1']).toBe('bar');
});

it('checks if there is .php translations', () => {
    expect(hasPhpFiles(__dirname + '/fixtures/requests/')).toBe(true);
    expect(hasPhpFiles(__dirname + '/fixtures/wrongRequestsFolder/')).toBe(false);
}); */
