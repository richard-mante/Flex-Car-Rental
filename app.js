const express = require('express');

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.send("this is just data");
})

app.listen(3050, () => {
    console.log('Server listening on port http://localhost:3050');
})