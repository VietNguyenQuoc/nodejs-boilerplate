module.exports = {
  signUpRules: {
    email: 'required|email',
    password: ['required', 'min:8', 'max:50', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'],
    firstName: 'required|max:255',
    lastName: 'required|max:255'
  }
}