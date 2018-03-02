var config =require('./dbconnection.json');
var mysql = require('mysql');
/*var db = conn.connection;
var MyAppModel = conn.MyAppModel;

var MemeDBModel = MyAppModel.extend({
    tableName: "meme",
});
 */
 var pool  = mysql.createPool(config);

var Subscriber={
 
subscribe:function(subscriberId, walletAddress, email, callback){
	pool.getConnection(function(err, connection) {
		if(err) {
	        console.log(err);
	      } else {
	      	var data = [walletAddress, subscriberId, email, 'admin', 'admin'];
	        connection.query("INSERT INTO user_subscription (wallet_address, subscriber_id, email, created_user, last_modified_user) VALUES  ? ON DUPLICATE KEY UPDATE subscriber_id = VALUES(subscriber_id), email = VALUES(email)", [[data]], function (error, results, fields) {
	          connection.release();
	          if (error) {
	            console.log(error);
	          } else {
	            callback(results);
	          }
	        });
	      }
	});
	
},

unsubscribe:function(subscriberId, callback){
	pool.getConnection(function(err, connection) {
		if(err) {
	        console.log(err);
	      } else {
	      	var data = [subscriberId];
	        connection.query("DELETE from user_subscription where subscriber_id = ? ", data, function (error, results, fields) {
	          connection.release();
	          if (error) {
	            console.log(error);
	          } else {
	            callback(results);
	          }
	        });
	      }
	});
}

};

module.exports = Subscriber;