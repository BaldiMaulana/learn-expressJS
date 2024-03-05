// app.js.
const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const path = require('path'); // Impor modul path
require('dotenv').config(); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({extended:true}))

const Todo = require('./app/models/todo');

const dbUrl = process.env.DB_URL;  

mongoose.connect(dbUrl) 

app.get('/', async (req, res) => {
  Todo.find() 
    .then(result => {
      res.render('index',{ data: result}) 
    }) 
});

app.post('/', async (req, res) => { 
  try {
    const todo = new Todo({ 
      todo: req.body.todoValue 
    });

    const result = await todo.save();

    res.redirect('/');
  } catch (error) {
    console.error('Error saving todo:', error);
    res.status(500).send('Terjadi kesalahan saat menyimpan todo');
  }
});
app.delete('/:id', async (req, res) => { 
  try {
      const todoId = req.params.id;
      await Todo.findByIdAndDelete(todoId);
      res.status(200).json({ message: 'Todo berhasil dihapus' });
  } catch (error) {
      console.error('Error deleting todo:', error);
      res.status(500).json({ message: 'Terjadi kesalahan saat menghapus todo' });
  }
});

app.listen(port, async () => {
  try {
    await dbUrl; // Menunggu koneksi ke MongoDB 
    console.log(`Example app listening on port ${port}`);
  } catch (error) {
    console.error('Error:', error);
  }
});
