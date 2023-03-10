import fs from 'fs'
import path from 'path'

export const hasPhpFiles = (folderPath: string): boolean => {
    folderPath = folderPath.replace(/[\\/]$/, '') + path.sep
  
    try {
      const folders = fs
        .readdirSync(folderPath)
        .filter((file) => fs.statSync(folderPath + path.sep + file).isDirectory())
        .sort()
  
      for (const folder of folders) {
        const lang = {}
  
        const files = fs.readdirSync(folderPath + path.sep + folder).filter((file) => /\.php$/.test(file))
  
        if (files.length > 0) {
          return true
        }
      }
    } catch (e) {}
  
    return false
  }