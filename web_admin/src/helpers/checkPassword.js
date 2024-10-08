const validatePassword = (_, value) => {
  if (!value) {
    return Promise.reject(new Error('Mật khẩu không để trống!'));
  }

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

  if (!hasUpperCase) {
    return Promise.reject(new Error('Mật khẩu phải chứa ít nhất một ký tự hoa!'));
  }

  if (!hasLowerCase) {
    return Promise.reject(new Error('Mật khẩu phải chứa ít nhất một ký tự thường!'));
  }

  if (!hasNumber) {
    return Promise.reject(new Error('Mật khẩu phải chứa ít nhất một số!'));
  }

  if (!hasSpecialChar) {
    return Promise.reject(new Error('Mật khẩu phải chứa ít nhất một ký tự đặc biệt!'));
  }

  return Promise.resolve();
}

export default validatePassword;