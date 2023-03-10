import fs from 'fs'
import path from 'path'
import { Engine, Program } from 'php-parser'
import Converter from './Converter'

export default class Loader {
  private requestsPath: string
  private converter: Converter

  constructor(requestsPath: string) {
    this.requestsPath = requestsPath.replace(/[\\/]$/, '') + path.sep
    this.converter = new Converter()
  }

  public async load(): Promise<string> {
    const files = await this.readFiles(this.requestsPath)
    const parser = new Engine({})

    let content = 'const yup = require(\'yup\');\n\n'

    for (const [name, file] of Object.entries(files)) {
      const ast = parser.parseCode(file, 'php')
      const item = this.parseItem(ast)
      const validationSchema = this.converter.convert(item)

      content +=  `exports.${name} = ${validationSchema};\n`
    }

    return content
  }

  private async readFiles(dir: string): Promise<{ [key: string]: string }> {
    const files = await fs.promises.readdir(dir) // Read the contents of the directory
    let fileContents = {}

    for (const file of files) {
      const name = file.replace(/Request\.[^.]+$/, '')
      const filePath = path.join(dir, file)
      const stats = await fs.promises.stat(filePath) // Get information about the file

      if (stats.isDirectory()) {
        // Recursively read files in the subdirectory
        const subDirectoryContents = await this.readFiles(file)
        fileContents = { ...fileContents, ...subDirectoryContents }
      } else if (stats.isFile() && path.extname(file) === '.php') {
        // Read the contents of the file if it has a .php extension
        fileContents[name] = await fs.promises.readFile(filePath, 'utf8')
      }
    }

    return fileContents
  }

  private parseItem(ast: Program): { [key: string]: string[] } {
    const namespaceNode = ast.children.find(node => node.kind === 'namespace') as any
    const rules = {}

    if (namespaceNode) {
      const classNode = namespaceNode.children.find(node => node.kind === 'class')

      if (classNode) {
        const rulesMethod = classNode.body.find(node => node.kind === 'method' && node.name.name === 'rules')
        const rulesArray = rulesMethod.body.children[0].expr.items

        for (const item of rulesArray) {
          const name = item.key.value
          if (item.value.kind === 'array') {
            const value = item.value.items.map(item => item.value.value)
            rules[name] = value
          } else if (item.value.kind === 'string') {
            const value = item.value.value
            rules[name] = value
          }
        }
      }
    }
    return rules
  }
}
