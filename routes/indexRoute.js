const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");

router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

router.get("/admin", ensureAuthenticated, (req, res) => {
  if(req.user.role === "admin"){
    const store = req.sessionStore
    store.all((error, sessions) => {
      if (error) {
          console.log(error);
      } else {
          const seshs = JSON.parse(JSON.stringify(sessions))
          console.log(seshs);
          const ids = Object.keys(seshs)
          console.log(ids)
          res.render("admin", {
            user: req.user,
            sessions : seshs,
            sessionsID :ids
          });
      }
    })
  }
})

router.post("/admin", ensureAuthenticated, (req, res) => {
  if(req.user.role === "admin"){
    req.sessionStore.destroy(req.body.SID,(err) => {
      if (err) {
        console.log(err)
      }
    })
    res.redirect("/admin")
  }
})
module.exports = router;
