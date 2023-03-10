import path from 'path'
import fs from 'fs'

import mix from 'laravel-mix'
import { Component } from 'laravel-mix/src/components/Component'
import { EnvironmentPlugin, Configuration } from 'webpack'

import { generateFiles, parseAll, hasPhpFiles } from './loader'

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
    context: any

    register(requestPath: string = 'app/HTTP/Requests'): void {
      this.requestPath = this.context.paths.rootPath + path.sep + requestPath
    }

    webpackConfig(config: Configuration): void {
      let files = []

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
          files = generateFiles(this.requestPath, [...parseAll(this.requestPath)])
        })
      )

      this.context.listen('build', () => {
        files.forEach((file) => {
          if (fs.existsSync(this.requestPath + file.name)) {
            fs.unlinkSync(this.requestPath + file.name)
          }
        })

        if (fs.existsSync(this.requestPath) && fs.readdirSync(this.requestPath).length < 1) {
          fs.rmdirSync(this.requestPath)
        }
      })
    }
  }
)
