const passport = require("passport");
const keys = require("../config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);
const requireLogin = require("../middlewares/requireLogin");

module.exports = app => {
  app.post("/api/stripe", requireLogin, async (req, res) => {
    const token = req.body.id;

    const charge = await stripe.charges.create({
      amount: 5 * 100,
      currency: "usd",
      description: "$5 for 5 email credits",
      source: token
    });

    req.user.incrementCredits(5);
    const user = await req.user.save();
    res.send(user);
  });
};