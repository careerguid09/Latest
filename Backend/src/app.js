  const express = require("express");
  const cors = require("cors");
  const clientRoutes = require("./routes/clientRoutes");
  const counselorRoutes = require("./routes/counselorRoutes");
  const visitorRoutes = require('./routes/visitorRoutes.js');

  const app = express();


  app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use("/clients", clientRoutes);
  app.use("/counselor", counselorRoutes);
  app.use('/visitors', visitorRoutes);



  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Something went wrong!" });
    next();
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  module.exports = app;