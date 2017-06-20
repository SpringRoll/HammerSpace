var rebound = new Hammer.Rebound();
var client = new Hammer.Client();
var myIframeID = 'myIframe';

client.addEvents(['connected', 'collectStar']);

client.on('connected', function() {
  document.querySelector('.connection').innerText = 'Connected';
});

client.on('collectStar', function(data) {
  var scoreDiv = document.querySelector('.score');
  scoreDiv.innerText = data;
});

rebound.setID(myIframeID);
rebound.setClient(client);

var togglePlayerSize = function() {
  client.dispatch('togglePlayerSize');
}
