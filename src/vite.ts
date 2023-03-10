import { hasPhpFiles } from './utils'
import Generator from '../src/Generator';

export default function laravelToYup(requestPath: string = 'app/HTTP/Requests', generatedPath: string = 'resources/js/vendor/laravel-to-yup', fileName: string = 'index') {
  let exitHandlersBound: boolean = false
  const generator = new Generator(requestPath, generatedPath, fileName)
  
  const clean = () => {
    generator.reset(true)
  }

  return {
    name: 'laravelToYup',
    enforce: 'post',
    config() {
      if (!hasPhpFiles(requestPath)) {
        return
      }

      generator.generate()

      /** @ts-ignore */
      process.env.VITE_LARAVEL_TO_YUP_HAS_PHP = true

      return {
        define: {
          'process.env.VITE_LARAVEL_TO_YUP_HAS_PHP': true
        }
      }
    },
    //buildEnd: clean,
    handleHotUpdate(ctx) {
      if (new RegExp(`/${requestPath}\/.*\.php$/`).test(ctx.file)) {
        generator.generate()
      }
    },
    configureServer() {
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
