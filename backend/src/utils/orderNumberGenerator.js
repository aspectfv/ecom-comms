// Generate unique order number
const generateOrderNumber = () => {
  return 'MF' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000);
};

module.exports = generateOrderNumber;