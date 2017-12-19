const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const keys = require("../config/keys");
const mongoose = require("mongoose");
const Survey = mongoose.model("surveys");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");
const _ = require("lodash");
const Path = require("path-parser");
const { URL } = require("url");

module.exports = app => {
  app.get("/api/surveys/test", async (req, res) => {
    const ret = await Survey.updateOne({
        _id: '5a389da6945eb839cc511472',
        recipients: {
            $elemMatch: {
                email: 'necrower@mailinator.com', responded: false
            }
        }
    }, {
        $inc: {'yes': 1},
        $set: {'recipients.$.responded': true}
    }).exec();

    console.log(ret)
  
      res.send({});
  });


  app.get("/api/surveys/thanks", (req, res) => {
    res.send("Thanks for voting!");
  });

  app.post("/api/surveys/webhooks", (req, res) => {
    const p = new Path("/api/surveys/:surveyId/:choice");
    // .filter(event => event.event === "click")

    const events = _.chain(req.body)
    .map(event => {
        const match = p.test(new URL(event.url).pathname);
        if (match) {
          return {
            email: event.email,
            surveyId: match.surveyId,
            choice: match.choice
          };
        }
      })
    .compact()
    .uniqBy("email", "surveyId")
    .each(({surveyId, email, choice}) => {
      Survey.updateOne({
          _id: surveyId,
          recipients: {
              $elemMatch: {
                  email: email, responded: false
              }
          }
      }, {
          $inc: {[choice]: 1},
          $set: {'recipients.$.responded': true}
      }).exec();

    })
    .value()

    console.log(events)

    res.send({});
  });

  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = await new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(",").map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    const mailer = new Mailer(survey, surveyTemplate(survey));
    try {
      await mailer.send();
      await survey.save();
      const user = await req.user.decrementCredits(1);
      res.send(user);
    } catch (error) {
      res.status(422).send(error);
    }
  });
};
