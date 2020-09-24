const express = require("express");
const path = require("path");

// !Sub components!
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
//-----------

// !IP white list!
const ipfilter = require("express-ipfilter").IpFilter;
const ips = [
  "::ffff:127.0.0.1",
  "::ffff:193.200.211.229",
  "::ffff:83.69.196.194",
  "::ffff:193.200.211.225",
  "::ffff:82.142.142.217",
  "::ffff:213.87.146.44",
];
//-----------

// !Logger
const morgan = require("morgan");
//-----------

// !Security!
const passport = require("passport");
const jwtPassport = require("./middleware/passport");
const helmet = require("helmet");
const cors = require("cors");
const scurf = require("csurf");
//-----------

// !Routing!
const authRoutes = require("./routes/auth");
const priceRoutes = require("./routes/price");
const userRoutes = require("./routes/user");
const timeTrackingRoutes = require("./routes/timeTracking");
const paymentRoutes = require("./routes/payment");
const travelAgentRoutes = require("./routes/travelAgent");
const refNumberRoutes = require("./routes/refNumber");
const watchRoutes = require("./routes/watch");
//-----------

// !Config Keys!
const keys = require("./config/keys");
//-----------

// !App!
const app = express();
//-----------

// Mongo Connection options
const options = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
mongoose
  .connect(keys.MONGO_URI, options)
  .then(() => console.log("MongoDb connected"))
  .catch((error) => console.log(error));
//-----------

// Logger use
app.use(morgan("dev"));
//-----------

// Express options for use
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
//-----------

// Security use
app.use(helmet());
app.use(cors());
app.use(passport.initialize());
jwtPassport(passport);
app.use(scurf({ cookie: true }));
app.all("*", function (req, res, next) {
  const key = req.csrfToken();
  res.cookie("XSRF-TOKEN", key);
  next();
});
//-----------

// Routing use
app.use("/api/auth", authRoutes);
app.use("/api/price", priceRoutes);
app.use("/api/user", userRoutes);
app.use("/api/time-tracking", timeTrackingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/travel-agent", travelAgentRoutes);
app.use("/api/ref-number", refNumberRoutes);
app.use("/api/watch", watchRoutes);
//-----------

if (process.env.NODE_ENV === "production") {
  // Mongo Configuration with sertificate from yandex
  //options.sslCA = fs.readFileSync('./config/CA.pem')
  // mongoose.connect(keys.mongoURI, options)
  //   .then(() => console.log('MongoDb connected'))
  //   .catch(error => console.log(error))
  //-----------

  // // app.use(ipfilter(ips, { mode: 'allow' }), express.static('client/dist/client'))
  // app.use("/", express.static('client/dist/client'))
  // app.use("/login", express.static('client/dist/client'))
  // // app.use("/register", ipfilter(ips, { mode: 'allow' }), express.static('client/dist/client'))
  app.use(express.static("client/dist/client"));
  // app.use('/main', express.static('client/dist/client'))
  // app.use('/main/news', express.static('client/dist/client'))
  // app.use('/', express.static('client/dist/client'))
  // app.use('/login', express.static('client/dist/client'))
  // app.use('/admin', express.static('client/dist/client'))
  // app.use('/admin/news', express.static('client/dist/client'))

  app.get("*", (req, res) => {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.sendFile(
      path.resolve(__dirname, "client", "dist", "client", "index.html")
    );
  });
}

module.exports = app;
