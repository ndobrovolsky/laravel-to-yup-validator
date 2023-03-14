import Generator from '../src/Generator';

/* beforeEach(() => reset(__dirname + '/fixtures/requests/')); */

it('creates a validation file', async () => {
    const requestsPath = __dirname + '/fixtures/requests/';
    const genrationPath = __dirname + '/fixtures/generated/';
    const generator = new Generator(requestsPath, genrationPath, 'validation');
    await generator.generate();

    const validation = require(genrationPath + 'validation.js');
    expect(validation.Test).toBeDefined();
    //expect(validation.Test2).toBeDefined();
    
    generator.reset(true);
});