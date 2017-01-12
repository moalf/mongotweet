var Twitter = require('twitter');
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://tweets:passwd@localhost:27017/tweets?authMechanism=SCRAM-SHA-1&authSource=tweets';

var client = new Twitter({
  consumer_key:        'YOUR_CONSUMER_KEY',
  consumer_secret:     'YOUR_CONSUMER_SECRET',
  access_token_key:    'YOUR_ACCESS_TOKEN_KEY',
  access_token_secret: 'YOUR_ACCESS_TOKEN_SECRET',
});

MongoClient.connect(url, function ( err, db ) {
  if (err) {
    console.error(err);
  }

  client.stream('statuses/filter', { track : 'amazon' }, function ( stream ) {
    stream.on('data', function ( tweet ) {
      var document = {
        text : tweet.text,
        user : tweet.user.name,
        location : tweet.user.location,
        followers : tweet.user.followers_count,
        friends : tweet.user.friends_count,
        statuses : tweet.user.statuses_count,
        created : tweet.user.created_at
      };

      db.collection('tweets').insert( document, function(err, db){
        if(err) {
          console.error(err);
          db.close();
        }
        console.log('tweet inserted in mongodb...');
      });

    });

    stream.on('error', function ( err ) {
      console.error(err); 
    });
  });
});
