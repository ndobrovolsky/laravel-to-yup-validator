import Generator from '../src/Generator';

/* beforeEach(() => reset(__dirname + '/fixtures/requests/')); */

it('creates a file for each requests', async () => {
    const requestsPath = __dirname + '/fixtures/requests/';
    const genrationPath = __dirname + '/fixtures/generated/';
    const generator = new Generator(requestsPath, genrationPath, 'validation');
    await generator.generate();

    const validation = require(genrationPath + 'validation.js');


    /* const requestsPath = __dirname + '/fixtures/requests/';
    await parseAll(requestsPath); */
    /* const files = generateFiles(requestsPath, parseAll(requestsPath));

    expect(files.length).toBe(3);
    expect(files[0].name).toBe('php_en.json');
    expect(files[1].name).toBe('php_fr.json');
    expect(files[2].name).toBe('php_pt.json');

    const requestsEn = JSON.parse(fs.readFileSync(requestsPath + files[0].name).toString());
    expect(requestsEn['auth.failed']).toBe('These credentials do not match our records.');
    expect(requestsEn['auth.foo.level1.level2']).toBe('baren');
    expect(requestsEn['auth.multiline']).toBe('Lorem ipsum dolor sit amet.');

    const requestsPt = JSON.parse(fs.readFileSync(requestsPath + files[2].name).toString());
    expect(requestsPt['auth.failed']).toBe('As credenciais indicadas não coincidem com as registadas no sistema.');
    expect(requestsPt['auth.foo.level1.level2']).toBe('barpt'); */
});

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
