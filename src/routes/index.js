// стандартный роутер, который читает и записывает данные.

import express from 'express';
import {readFile, writeFile} from '../utils'

var router = express.Router();

router
  .get('/data', (req, res) => {
    readFile('notes.json').then(notes => {
      readFile('carriers.json').then(carriers => {
        res.json({notes, carriers})
      })
    })
  })
  .post('/notes', ({body}, res) => {
    console.log('BODY:', body)
    const {notes} = body;
    writeFile('notes.json', notes).then(() => {
      res.status(201).end();
    })
  })
  .post('/carriers', ({body}, res) => {
    const {carriers} = body;
    writeFile('carriers.json', carriers).then(() => {
      res.status(201).end();
    })
  })


export default router;
