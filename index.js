const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const allowCrossDomain = function(req, res, next) {
//  res.header('Access-Control-Allow-Origin', 'https://app.reearth.io')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'POST')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, X-Esri-Authorization, access_token'
  )

  if ('OPTIONS' === req.method) {
    res.sendStatus(200)
  } else {
    next()
  }
}
app.use(allowCrossDomain)

app.post('/', (req, res) => {
    const x_esri_authorization = req.headers['x-esri-authorization'];
    const id = req.body['id'];
    console.log("X-Esri-Authorization: " + x_esri_authorization);
    console.log("id: " + id);

    const API_URL = 'https://u-tokyo.maps.arcgis.com/sharing/rest/content/items/' + id + '/data';
    console.log('API_URL= '+API_URL);
    let param = {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         'X-Esri-Authorization': ''
          };
          param['X-Esri-Authorization'] = x_esri_authorization;

      try {
	(async () => {
          const response =  await fetch(API_URL, {method: 'POST', headers: param});
          const body = await response.text();
console.log("body: " + body);
          res.send(body);
	  res.end();
	})();
      }
      catch (e) {
          console.error(e);
          return 500;
      }
  }
  );


const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});
