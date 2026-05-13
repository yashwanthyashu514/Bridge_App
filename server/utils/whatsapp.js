const axios = require('axios');

const BASE_URL = `${process.env.META_WHATSAPP_API_URL}/${process.env.META_PHONE_NUMBER_ID}/messages`;

const sendWhatsApp = async (to, message) => {
  // Normalize number: remove spaces, ensure country code
  const phone = to.replace(/\s+/g, '').replace(/^0/, '91');
  try {
    await axios.post(
      BASE_URL,
      {
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.META_WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return { success: true };
  } catch (err) {
    console.error('WhatsApp send error:', err.response?.data || err.message);
    return { success: false, error: err.message };
  }
};

// Send to multiple numbers in parallel
const sendWhatsAppBulk = async (numbers, message) => {
  const results = await Promise.allSettled(
    numbers.filter(Boolean).map(n => sendWhatsApp(n, message))
  );
  return results;
};

module.exports = { sendWhatsApp, sendWhatsAppBulk };
