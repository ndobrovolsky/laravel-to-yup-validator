import Generator from './Generator';

export default function laravelToYup(requestPath: string = 'app/Http/Requests', generatedPath: string = 'resources/js/vendor/laravel-to-yup', fileName: string = 'index') {
  let exitHandlersBound: boolean = false

  const generator = new Generator(requestPath, generatedPath, fileName)

  const clean = () => {
    generator.reset(true)
  }

  return {
    name: 'laravelToYup',
    enforce: 'post',
    config() {
      generator.generate()
    },
    //buildEnd: clean,
    handleHotUpdate(ctx) {
      const regexPath = generator.getRequestsPath().replace(/\//g, '\\/');
      if (new RegExp(`${regexPath}.*\.php$`).test(ctx.file)) {
        generator.generate();
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
