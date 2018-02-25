const express = require('express');
const app = express();
app.set('view engine', 'ejs')
app.use(express.static('.'));

app.get('/', function (req, res) {
  res.sendFile('/Users/slakshman/Google Drive/OneDrive/CRYPTO/cryptovideogame/index.html');
})

app.listen(8000, function () {
  console.log('Crypto Meme app listening on port 3000!')
})