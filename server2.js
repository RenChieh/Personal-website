let express = require('express');
let path = require('path');
let fs = require('fs');
let MongoClient = require('mongodb').MongoClient;
let bodyParser = require('body-parser');
let app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "Homepage.html"));    
  });

app.get('/work', function (req, res) {
  res.sendFile(path.join(__dirname, "work.html"));
});

app.get('/message', function (req, res) {
  res.sendFile(path.join(__dirname, "message2.html"));    
});

app.get('/profile-picture', function (req, res) {
  let img = fs.readFileSync(path.join(__dirname, "images/me.png"));
  res.writeHead(200, {'Content-Type': 'image/png' });
  res.end(img, 'binary');
});

// use when starting application locally
let mongoUrlLocal = "mongodb://admin:password@localhost:27017";

// use when starting application as docker container
let mongoUrlDocker = "mongodb://admin:password@mongodb";

// pass these options to mongo client connect request to avoid DeprecationWarning for current Server Discovery and Monitoring engine
let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// "user-account" in demo with docker. "my-db" in demo with docker-compose
let databaseName = "user-account";

// 新增用戶資料的路由 
app.post('/add-user', function (req, res) {
    let userObj = req.body;

    MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
        if (err) throw err;

        let db = client.db(databaseName);

        // 新增用戶
        db.collection("users").insertOne(userObj, function (err, result) {
            if (err) throw err;
            client.close();

            // 回傳新用戶資料
            res.send(userObj);
        });
    });
});

// 獲取所有用戶的路由
app.get('/get-users', function (req, res) {
    MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
        if (err) throw err;

        let db = client.db(databaseName);

        // 查找所有用戶
        db.collection("users").find({}).toArray(function (err, result) {
            if (err) throw err;
            client.close();

            // 回傳用戶列表
            res.send(result);
        });
    });
});

app.listen(3000, function () {
  console.log("app listening on port 3000!");
});
