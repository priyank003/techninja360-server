const mongoose = require("mongoose");

const Schema = require("mongoose").Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const merchantSchema = new Schema(
  {
    
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,

    }
  },
  {
    timestamps: true,
    strict: false,
  }
);

merchantSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

// merchantSchema.statics.isEmailTaken = async function (email, excludeUserId) {
//   const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
//   return !!user;
// };

// merchantSchema.methods.isPasswordMatch = async function (password) {
//   const user = this;
//   return bcrypt.compare(password, user.password);
// };

// merchantSchema.pre("save", async function (next) {
//   const user = this;
//   if (user.isModified("password")) {
//     user.password = await bcrypt.hash(user.password, 8);
//   }
//   next();
// });
module.exports = mongoose.model("Merchant", merchantSchema);
