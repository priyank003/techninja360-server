const User = require("../models/user/user.mongo");

const httpUpdateProfile = async (req, res) => {
  const user_data = req.body;

  const user_id = req.userData.user_id;

  await User.updateOne(
    { user_id: user_id },
    {
      ...user_data,
    },
    {
      upsert: true,
    }
  );

  res.status(200).json({
    status: "ok",
    message: "updated profile",
    result: user_data,
  });
};

const httpChangePassword = (req, res) => {
  const user_id = req.userData.user_id;
  User.findOne({ user_id: user_id }, (err, user) => {
    // Check if error connecting
    if (err) {
      res.json({ success: false, message: err }); // Return error
    } else {
      // Check if user was found in database
      if (!user) {
        res.json({ success: false, message: "User not found" }); // Return error, user was not found in db
      } else {
        user.changePassword(
          req.body.old_password,
          req.body.new_password,
          function (err) {
            if (err) {
              if (err.name === "IncorrectPasswordError") {
                res.json({ success: false, message: "Incorrect password" }); // Return error
              } else {
                res.json({
                  success: false,
                  message:
                    "Something went wrong!! Please try again after sometimes.",
                });
              }
            } else {
              res.json({
                success: true,
                message: "Your password has been changed successfully",
              });
            }
          }
        );
      }
    }
  });
};

const httpGetProfileDetails = async (req, res) => {
  const user_id = req.userData.user_id;

  try {
    const user = await User.findOne({ user_id: user_id });

    res.status(201).json({
      status: "ok",
      results: user,
    });
  } catch (err) {
    console.log(`Could not get user details due to ${err}`);
  }
};

module.exports = {
  httpUpdateProfile,
  httpChangePassword,
  httpGetProfileDetails,
};
