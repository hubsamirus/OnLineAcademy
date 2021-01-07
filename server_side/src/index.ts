import express, {Application } from 'express';
import bodyParser from 'body-parser';

class Server {
    public app: Application;

    constructor(){
       this.app = express();
    }
    config(): void{
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(bodyParser.json());
        this.app.set('Access-Control-Allow-Origin', '*');
        this.app.set('Access-Control-Allow-Methods', 'GET, POST, PUT,DELETE');
        this.app.set('Access-Control-Allow-Headers', 'Content-Type, Authorization ');
    }
    routes(): void{}
    start(): void{
        this.app.listen(this.app.get('port'), () => {
            console.log('server listen on port' + this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
