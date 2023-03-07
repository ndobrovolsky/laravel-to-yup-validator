import fs from 'fs';
import path from 'path';
import { Engine } from 'php-parser'
import { generateFiles, parseAll, parse, hasPhpTranslations, reset } from '../src/loader';

beforeEach(() => reset(__dirname + '/fixtures/lang/'));

/* it('includes .php lang file in nested subdirectory in .json', () => {
    const langPath = __dirname + '/fixtures/lang/';
    const files = generateFiles(langPath, parseAll(langPath));
    const langEn = JSON.parse(fs.readFileSync(langPath + files[0].name).toString())

    expect(langEn['nested.cars.car.is_electric']).toBe('Electric');
    expect(langEn['nested.cars.car.foo.level1.level2']).toBe('barpt');
}) */

const parser = new Engine({
    // some options :
    parser: {
        extractDoc: true,
        php7: true,
    },
    ast: {
        withPositions: true,
    },
});

async function readFilesRecursively(dir: string) {
    const files = await fs.promises.readdir(dir); // Read the contents of the directory
    let fileContents = {};

    for (const file of files) {
        const name = file.replace(/Request\.[^.]+$/, '');
        const filePath = path.join(dir, file);
        const stats = await fs.promises.stat(filePath); // Get information about the file

        if (stats.isDirectory()) {
            // Recursively read files in the subdirectory
            const subDirectoryContents = await readFilesRecursively(file);
            fileContents = { ...fileContents, ...subDirectoryContents };
        } else if (stats.isFile() && path.extname(file) === '.php') {
            // Read the contents of the file if it has a .php extension
            fileContents[name] = await fs.promises.readFile(filePath, 'utf8');
        }
    }

    return fileContents;
}

it('transforms requests to .json', async () => {
    const dir = __dirname + '/fixtures/requests/';
    const requests = await readFilesRecursively(dir)
    
    Object.keys(requests).forEach((request) => {
        const ast = parser.parseCode(requests[request], 'php');
        const namespaceNode = ast.children.find(node => node.kind === 'namespace') as any;

        if (namespaceNode) {
            const classNode = namespaceNode.children.find(node => node.kind === 'class');

            if(classNode) {
                const rulesMethod = classNode.body.find(node => node.kind === 'method' && node.name.name === 'rules');
                const rulesArray = rulesMethod.body.children[0].expr.items;

                for (const item of rulesArray) {
                    const field = item.key.value;
                    const rules = item.value.value.split('|');
                    console.log(`Rules for ${field}: ${rules.join(', ')}`);
                }
            }
        }

    });


    /* const lang = parse(fs.readFileSync(__dirname + '/fixtures/requests/').toString());

    expect(lang['failed']).toBe('These credentials do not match our records.'); */
});

/* it('transform nested .php lang files to .json', () => {
    const langPt = parse(fs.readFileSync(__dirname + '/fixtures/lang/pt/auth.php').toString());
    expect(langPt['foo.level1.level2']).toBe('barpt');

    const langEn = parse(fs.readFileSync(__dirname + '/fixtures/lang/en/auth.php').toString());
    expect(langEn['foo.level1.level2']).toBe('baren');
}); */