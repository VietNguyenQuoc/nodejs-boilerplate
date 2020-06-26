module.exports = (digit) => {
  if (digit <= 0) throw new Error('digit must be greater than or equal 1');

  return Math.ceil(Math.random() * Math.pow(10, Math.ceil(digit)));
}