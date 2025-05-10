
function detectFraud({ amount, source, status }) {
  const flaggedReasons = [];

  if (amount > 1000000) flaggedReasons.push('Amount exceeds ₦1,000,000');
  if (source.toLowerCase() === 'unknown') flaggedReasons.push('Source is unknown');
  if (status.toLowerCase() === 'failed') flaggedReasons.push('Transaction failed');

  return {
    isFraudulent: flaggedReasons.length > 0,
    reasons: flaggedReasons,
  };
}

module.exports = detectFraud;
