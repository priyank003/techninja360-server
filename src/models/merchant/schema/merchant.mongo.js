const mongoose = require("mongoose");

const Schema = require("mongoose").Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const MerchantSchema = new Schema(
  {
    email: {
      type: String,
    },
  },
  {
    strict: false,
  }
);

MerchantSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

// UserSchema.methods.findOrCreate = function ()

module.exports = mongoose.model("Merchant", MerchantSchema);
