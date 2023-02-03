const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subContactSchema = new Schema({
  title: String,
  name: {
    first_name: String,
    middle_name: String,
    last_name: String,
  },
  phone_no: {
    primary_ph: Number,
    alternate_ph: Number,
  },
  gender: String,
  primary_email: String,
});

const ContactSchema = new Schema({
  merchant_id: String,
  primary_contact: subContactSchema,
  alternate_contact: subContactSchema,
});

module.exports = mongoose.model("Contact", ContactSchema);
