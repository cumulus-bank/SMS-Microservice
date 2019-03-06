import * as express from "express";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
import * as twilio from 'twilio';
class App {
  public jwtOptions: any = {};

  public express: express.Application;
  public connectionString: String;
  public accountSid : any; // Your Account SID from www.twilio.com/console
  public authToken : any; 
  public senderNumber: any;
  public client: any;
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.accountSid = 'AC9aa55fd77004f4947be573d4cceab649';
    this.authToken = '23dff5a6162067503454b0d73eb99843';
    // this.senderNumber = process.env.senderNumber;
    this.client = twilio(this.accountSid, this.authToken);
  }
  private middleware(): void {
    this.express.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With,content-type"); 
      res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE"); 
      next();
    });
    this.express.use(logger("dev"));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }
  private routes(): void {
    let router = express.Router();
    router.get("/send", (req, res, next) => {
      this.client.messages.create({
        body: 'Hello from Node',
        to: '+971509786313',  // Text this number
        from: '+15125482057' // From a valid Twilio number
    })
    .then((message) => {
      res.json({msg:message.sid})
    console.log(message.sid)
    }
    ).error((msg)=>{
      res.json({msg:'something wnet wrong'})
    });
    });
    router.get("/healthz", (req, res, next) => {
      res.send("success");
    });
    this.express.use("/", router);
  }
}
export default new App().express;
