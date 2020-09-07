// функция проверяет файл на факт его существования.

import fs from 'fs'
import path from 'path'

export default function (fileName) {
  return new Promise((resolve) => {
    fs.access(path.resolve(__dirname, '..', '..', ...fileName), fs.F_OK, (err) => {
      if (err) {
        //console.error(err);
        resolve(false);
        return false   
      }
      resolve(true);
      return true
    })
  })

};
