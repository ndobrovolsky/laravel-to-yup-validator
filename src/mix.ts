import mix from 'laravel-mix'
import { Component } from 'laravel-mix/src/components/Component'
import { EnvironmentPlugin, Configuration } from 'webpack'

import { hasPhpFiles } from './utils'
import Generator from '../src/Generator';

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

    register(requestPath: string = 'app/HTTP/Requests', generatedPath: string = 'resources/js/vendor/laravel-to-yup', fileName: string = 'index'): void {
      this.requestPath = requestPath
      this.generatedPath = generatedPath
      this.fileName = fileName
    }

    webpackConfig(config: Configuration): void {
      const generator = new Generator(this.requestPath, this.generatedPath, this.fileName)

      config.watchOptions = {
        ignored: /php.*\.json/
      }

      if (hasPhpFiles(this.requestPath)) {
        config.plugins.push(
          new EnvironmentPlugin({
            LARAVEL_TO_YUP_HAS_PHP: true
          })
        )
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
