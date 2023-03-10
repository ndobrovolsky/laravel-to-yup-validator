import mix from 'laravel-mix'
import { Component } from 'laravel-mix/src/components/Component'
import { Configuration } from 'webpack'
import Generator from './Generator';

class BeforeBuildPlugin {
  callback: Function

  constructor(callback: Function) {
    this.callback = callback
  }

  apply(compiler): void {
    compiler.hooks.compile.tap('BeforeBuildPlugin', this.callback)
  }
}

mix.extend(
  'laravelToYup',
  class extends Component {
    requestPath: string
    generatedPath: string
    fileName: string
    context: any

    register(requestPath: string = 'app/Http/Requests', generatedPath: string | null = null, fileName: string = 'index'): void {
      this.requestPath = requestPath
      this.generatedPath = generatedPath || __dirname + '/generated'
      this.fileName = fileName
    }

    webpackConfig(config: Configuration): void {
      const generator = new Generator(this.requestPath, this.generatedPath, this.fileName)

      config.watchOptions = {
        ignored: /php.*\.json/
      }

      config.plugins.push(
        new BeforeBuildPlugin(() => {
          generator.generate()
        })
      )

      this.context.listen('build', () => {
        generator.reset(true)
      })
    }
  }
)
