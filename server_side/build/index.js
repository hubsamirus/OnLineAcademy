const express = require('express');
const bodyParse = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParse.json());
app.use(( req,res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT,DELETE");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization "
    );
    next();
});
app.listen(port, () => {
    return console.log(`connected on port ${port}`);
})
