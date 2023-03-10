import path from 'path'
import { existsSync, unlinkSync, readdirSync, rmdirSync } from 'fs'
import { parseAll, hasPhpFiles, generateFiles } from './loader'
import { ParsedRequestInterface } from './interfaces/parsed-request'

export default function laravelToYup(requestPath: string = 'app/HTTP/Requests') {
  requestPath = requestPath.replace(/[\\/]$/, '') + path.sep

  let files: ParsedRequestInterface[] = []
  let exitHandlersBound: boolean = false

  const clean = () => {
    files.forEach((file) => unlinkSync(requestPath + file.name))

    files = []

    if (existsSync(requestPath) && readdirSync(requestPath).length < 1) {
      rmdirSync(requestPath)
    }
  }

  return {
    name: 'laravelToYup',
    enforce: 'post',
    config() {
      if (!hasPhpFiles(requestPath)) {
        return
      }

      files = generateFiles(requestPath, [...parseAll(requestPath)])

      /** @ts-ignore */
      process.env.VITE_LARAVEL_TO_YUP_HAS_PHP = true

      return {
        define: {
          'process.env.VITE_LARAVEL_TO_YUP_HAS_PHP': true
        }
      }
    },
    buildEnd: clean,
    handleHotUpdate(ctx) {
      if (new RegExp(`/${requestPath}\/.*\.php$/`).test(ctx.file)) {
        files = generateFiles(requestPath, [...parseAll(requestPath)])
      }
    },
    configureServer(server) {
      if (exitHandlersBound) {
        return
      }

      process.on('exit', clean)
      process.on('SIGINT', process.exit)
      process.on('SIGTERM', process.exit)
      process.on('SIGHUP', process.exit)

      exitHandlersBound = true
    }
  }
}
