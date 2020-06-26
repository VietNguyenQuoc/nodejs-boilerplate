module.exports = ({
  email,
  firstName,
  lastName,
  confirm = false,
  verifyToken
}) => {
  return ({
    email,
    firstName,
    lastName,
    confirm,
    verifyToken
  });
}