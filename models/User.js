const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  credits: {
    type: Number,
    default: 0
  }
});

userSchema.methods.incrementCredits = async function(credits, cb) {
  this.credits += (credits || 0);
  return await this.save();
};

userSchema.methods.decrementCredits = async function(credits, cb) {
  this.credits -= (credits || 0);
  return await this.save();
};

mongoose.model("users", userSchema);
