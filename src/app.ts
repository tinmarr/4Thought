import express from 'express';
import path from 'path';

const app = express();
const port = 8000;

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index', {title: 'Welcome'});
});

app.get('/text_editor', (req, res) =>{
    res.render('editor', {title: 'Editor'});
});

app.listen(port, () => {
    console.log(`server is listening on ${port}`);
});