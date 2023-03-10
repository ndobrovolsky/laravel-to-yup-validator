import fs from 'fs'
import path from 'path'
import Loader from './Loader'

export default class Generator {
  private requestsPath: string
  private generatedPath: string
  private fileName: string
  private loader: Loader

  constructor(requestsPath: string, generatedPath: string, fileName: string) {
    this.requestsPath = requestsPath.replace(/[\\/]$/, '') + path.sep
    this.generatedPath = generatedPath.replace(/[\\/]$/, '') + path.sep
    this.fileName = fileName
    this.loader = new Loader(this.requestsPath)
  }

  public getRequestsPath(): string {
    return this.requestsPath
  }

  public getGeneratedPath(): string {
    return this.generatedPath
  }
  public getFileName(): string {
    return this.fileName
  }


  public async generate() {
    const content = await this.loader.load();

    if (!fs.existsSync(this.generatedPath)) {
      fs.mkdirSync(this.generatedPath, { recursive: true })
    } else {
      this.reset()
    }

    fs.writeFileSync(this.generatedPath + this.fileName + '.js', content)
  }

  public reset(removeDir = false) {
    const dir = fs.readdirSync(this.generatedPath)

    for (const file of dir) {
      fs.unlinkSync(this.generatedPath + file)
    }

    if (removeDir)
      fs.rmdirSync(this.generatedPath, { recursive: true })
  }
}
