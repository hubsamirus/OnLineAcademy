import express, {Application } from 'express';

class Server {
    public app: Application;

    constructor(){
       this.app = express();
    }
    config(): void{
        this.app.set('port', process.env.PORT || 3000);
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
