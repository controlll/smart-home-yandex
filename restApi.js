var https = require('https');
var fs = require('fs');
var express         = require('express');
var path            = require('path'); // модуль для парсинга пути
var logger          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override')

class restApi {
    constructor(){
        this.app = express();
        this.timer = 0;
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "https://*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(methodOverride('X-HTTP-Method-Override'));
        this.app.use(express.static(path.join(__dirname, "public")));
        this.init();
    }

    init(){
        var self = this;
        setInterval(function(){
            self.timer+=1;
        }, 1000);

        this.app.get('/yandex_auth', function (req, res) {
            console.log('/yandex_auth:', req.query);
            res.send('<a href="'+req.query.redirect_uri+'?code=test123&state='+req.query.state+'">'+req.query.redirect_uri+'?code=test123&state='+req.query.state+'</a>');
        });
        this.app.post('/yandex_token', function (req, res) {
            console.log('/yandex_token:', req.body);
            res.send({"access_token":"acceess123456789","token_type":"bearer","expires_in":2592000,"refresh_token":"refresh123456789"});
        });
        this.app.get('/api', function (req, res) {
            console.log(req);
            res.send('API is running ' + self.timer + 's');
        });
        this.app.get('/v1.0/user/devices', function (req, res) {
            var r = {
                request_id:"1",
                payload:{
                    user_id:"1",
                    devices:[]
                }
            };
            for(var i in global.devices){
                r.payload.devices.push(global.devices[i].getInfo());
            }
            res.send(r);
        });
        this.app.post('/v1.0/user/devices/action', function(req, res){
            console.log(req.body.payload.devices);
            var r = {
                request_id: "1",
                payload: {
                    devices:[]
                }
            };
            for(var i in req.body.payload.devices){
                var id = req.body.payload.devices[i].id;
                var capabilities = global.devices[id].setState(req.body.payload.devices[i].capabilities[0].state.value);
                r.payload.devices.push({id:id, capabilities:capabilities});
            }
            res.send(r);
        });

        this.app.listen(5554, function(){
            console.log('Express server listening on port 5555');
        });
        const options = {
            cert: fs.readFileSync('./sslcert/fullchain.pem'),
            key: fs.readFileSync('./sslcert/privkey.pem')
        };
        https.createServer(options, this.app).listen(5553);
    }
}
module.exports = restApi;