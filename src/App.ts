import * as express from "express";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
import * as twilio from "twilio";
class App {
  public jwtOptions: any = {};

  public express: express.Application;
  public connectionString: String;
  public accountSid: any;
  public authToken: any;
  public senderNumber: any;
  public client: any;
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.accountSid = 'AC9aa55fd77004f4947be573d4cceab649';
    this.authToken = '23dff5a6162067503454b0d73eb99843';
    this.senderNumber = '+15125482057';
    this.client = twilio(this.accountSid, this.authToken);
  }
  private middleware(): void {
    this.express.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
      );
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
      );
      next();
    });
    this.express.use(logger("dev"));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }
  private routes(): void {
    let router = express.Router();
    router.post("/send", (req, res, next) => {
      let client = twilio(this.accountSid, this.authToken);
      client.messages
        .create({
          body: req.body.message,
          to: req.body.reciever,
          from: this.senderNumber
        })
        .then(message => {
          res.json({ msg: message.sid });
          console.log(message.sid);
        })
    });
    router.get("/healthz", (req, res, next) => {
      res.send("success");
    });
    this.express.use("/", router);
  }
}
export default new App().express;
