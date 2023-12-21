const sendToken = async (user, statusCode, res) => {
  const token = user.getJWTToken();

  user.tokens.push({ token:token });
  await user.save();
  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  const sessionId = Math.random().toString(36).substring(2);

  res.cookie("token", token, options);
};

module.exports = sendToken;