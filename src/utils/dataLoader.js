import {writeFileSync} from 'fs'
import {resolve} from 'path'

import {writeFile, fileChecker, readFile} from '../utils'
import { blueBright, greenBright, redBright } from 'chalk'
import axios from 'axios'
import {v4} from 'uuid'

export default (launchServer) => {
  const yandexDiskHeaders = { Authorization: process.env.DISK_TOKEN || '' };

  const getUrl = fileName => `https://cloud-api.yandex.net/v1/disk/resources/upload?path=disk%3A%2Flogistic-management%2F${fileName}&overwrite=true`

  function updater() {
    function readAndUpdate(fileName) {
      readFile(fileName).then(data => {

        axios.get(getUrl(fileName), {headers: yandexDiskHeaders}).then(({data: uploadData}) => {
          axios.put(uploadData.href, data, {headers: yandexDiskHeaders}).then(() => {
            console.log('SUCCESS_SUPER_SAVE')
          }).catch(er => console.log('GET_UPLOAD_HREF_ERROR: ', er))
        }).catch(er => console.log('GET_UPLOAD_HREF_ERROR: ', er))
      })
    }
    for(let fileName of ['notes.json', 'carriers.json']) {
      fileChecker(['data', fileName]).then(exist => {
        if(exist) [
          readAndUpdate(fileName)
        ]
      })
   
    }
    setTimeout(updater, 60000*60*12);
  };

  fileChecker(['public', 'about.pdf']).then(exist => {
    if(!exist) {
      axios.get('https://cloud-api.yandex.net/v1/disk/resources?path=disk%3A%2Fabout.pdf', 
      {headers: yandexDiskHeaders})
        .then(({data: {name, file}}) => {
          axios.get(file, {headers: yandexDiskHeaders, responseType: 'arraybuffer'})
            .then(({data}) => {
              const res = Buffer.from(data, 'binary')
              //writeFile([__dirname, '..', '..', 'public', name], res)
              writeFileSync(resolve(__dirname, '..', '..', 'public', name), res, 'binary')
            })
        })
    }
  })

  axios.get('https://cloud-api.yandex.net/v1/disk/resources?path=disk%3A%2Flogistic-management',
    {headers: yandexDiskHeaders})
    .then(({data: {_embedded: {items}}}) => {
      for(let {name, file} of items) {
        fileChecker(['data', name])
          .then(exist => {
            if(!exist) {
              axios.get(file, {headers: yandexDiskHeaders})
                .then(({data}) => {
                  writeFile(name, data).then(() => {
                    console.log('SUCCESS_CREATE ', name)
                  })
                })
            }
          })
      }
      launchServer();
      updater()
    })
}