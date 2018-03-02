const express = require('express');
const app = express();
const SubscribeModel = require('./models/Subscription');
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.set('view engine', 'ejs')
app.use(express.static('.'));

app.get('/', function (req, res) {
  res.sendFile('/Users/slakshman/Google Drive/OneDrive/CRYPTO/cryptovideogame/index.html');
})

app.post('/api/subscribe', function (req, res) {
	
  var subscriberId = req.body.id;
  var walletAddress = req.body.walletAddress;
  var email = req.body.email;
  responseJson = {}
  SubscribeModel.subscribe(subscriberId, walletAddress, email,function(err, result){
		if(err){
			responseJson =  JSON.parse(JSON.stringify(err));
		}else{
			responseJson =  JSON.parse(JSON.stringify(result));
		}
		res.send(responseJson);
	});
})

app.post('/api/unsubscribe', function (req, res) {
	
  var subscriberId = req.body.id;
  responseJson = {}
  SubscribeModel.unsubscribe(subscriberId, function(err, result){
		if(err){
			responseJson =  JSON.parse(JSON.stringify(err));
		}else{
			responseJson =  JSON.parse(JSON.stringify(result));
		}
		res.send(responseJson);
	});
})

app.post('/api/notifyAll', function (req, res) {
  var key = req.body.key;
  delete req.body.key;
  var notifDetails = req.body;
  responseJson = {}
  SubscribeModel.notifyAll(key, notifDetails, function(err, result){
		if(err){
			responseJson =  JSON.parse(JSON.stringify(err));
		}else{
			responseJson =  JSON.parse(JSON.stringify(result));
		}
		res.send(responseJson);
	});
})

app.listen(8000, function () {
  console.log('Crypto Meme app listening on port 3000!')
})