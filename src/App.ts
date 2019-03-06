import * as express from "express";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
import * as twilio from "twilio";
class App {
  public jwtOptions: any = {};

  public express: express.Application;
  public connectionString: String;
  public accountSid: any; // Your Account SID from www.twilio.com/console
  public authToken: any;
  public senderNumber: any;
  public client: any;
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.accountSid = process.env.accountSid;
    this.authToken = process.env.authToken;
    this.senderNumber = process.env.senderNumber;
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
    router.get("/send", (req, res, next) => {
      this.client.messages
        .create({
          body: req.body.message,
          to: req.body.reciever,
          from: this.senderNumber // From a valid Twilio number
        })
        .then(message => {
          res.json({ msg: message.sid });
          console.log(message.sid);
        })
        .error(msg => {
          res.json({ msg: "something went wrong" });
        });
    });
    router.get("/healthz", (req, res, next) => {
      res.send("success");
    });
    this.express.use("/", router);
  }
}
export default new App().express;
