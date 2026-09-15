const nodemailer = require('nodemailer');

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const sendOrderConfirmationEmail = async (order, userEmail) => {
  try {
    const isPlaceholder = !process.env.EMAIL_USER || process.env.EMAIL_USER.includes('your_email') || !process.env.EMAIL_PASS || process.env.EMAIL_PASS.includes('your_app_password');

    let transporter;
    if (isPlaceholder) {
      console.log('📬 [EMAIL SIMULATOR] Detected placeholder SMTP config. Running email mock logger.');
      transporter = {
        sendMail: async (options) => {
          console.log(`\n======================================================`);
          console.log(`📧 MOCK EMAIL SENT SUCCESSFULLY TO: ${options.to}`);
          console.log(`Subject: ${options.subject}`);
          console.log(`------------------------------------------------------`);
          console.log(`Text Summary:\n${options.text}`);
          console.log(`======================================================\n`);
          return { messageId: 'mock-id-12345' };
        }
      };
    } else {
      transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }

    const orderIdUpper = order._id.toString().slice(-8).toUpperCase();
    const itemsHtml = order.orderItems.map(item => `
      <tr style="border-bottom: 1px solid #edf2f7;">
        <td style="padding: 12px 0; color: #2d3748; font-weight: 600;">${escapeHtml(item.name)}</td>
        <td style="padding: 12px 0; color: #718096; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 0; color: #2d3748; text-align: right; font-weight: 700;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const discountRow = order.discountPrice > 0 ? `
      <tr>
        <td colspan="2" style="padding: 8px 0; color: #718096; text-align: right;">Promo Discount (${order.couponCode || 'Promo'}):</td>
        <td style="padding: 8px 0; color: #e53e3e; text-align: right; font-weight: 700;">-$${order.discountPrice.toFixed(2)}</td>
      </tr>
    ` : '';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - #${orderIdUpper}</title>
      </head>
      <body style="font-family: 'Inter', -apple-system, sans-serif; background-color: #f7fafc; margin: 0; padding: 40px 20px; -webkit-font-smoothing: antialiased;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #1f8044, #155e34); padding: 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Amal Market</h1>
            <p style="color: #c2f0d5; margin: 8px 0 0 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px;">Order Confirmation</p>
          </div>

          <!-- Body -->
          <div style="padding: 40px;">
            <h2 style="color: #2d3748; margin: 0 0 12px 0; font-size: 22px; font-weight: 800;">Thank you for your purchase!</h2>
            <p style="color: #718096; font-size: 15px; line-height: 1.6; margin: 0 0 32px 0;">
              Hi ${escapeHtml(order.shippingAddress.fullName)}, your order <strong>#${orderIdUpper}</strong> has been successfully placed and is now being processed by our store team. Here is your receipt details:
            </p>

            <!-- Order Summary Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr style="border-bottom: 2px solid #e2e8f0;">
                  <th style="padding: 12px 0; color: #4a5568; font-weight: 700; text-align: left; font-size: 13px; text-transform: uppercase;">Item</th>
                  <th style="padding: 12px 0; color: #4a5568; font-weight: 700; text-align: center; font-size: 13px; text-transform: uppercase; width: 60px;">Qty</th>
                  <th style="padding: 12px 0; color: #4a5568; font-weight: 700; text-align: right; font-size: 13px; text-transform: uppercase; width: 100px;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Totals -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
              <tr>
                <td colspan="2" style="padding: 8px 0; color: #718096; text-align: right; font-size: 14px;">Subtotal:</td>
                <td style="padding: 8px 0; color: #2d3748; text-align: right; font-weight: 700; width: 100px;">$${order.itemsPrice.toFixed(2)}</td>
              </tr>
              ${discountRow}
              <tr>
                <td colspan="2" style="padding: 8px 0; color: #718096; text-align: right; font-size: 14px;">Delivery Fee:</td>
                <td style="padding: 8px 0; color: #2d3748; text-align: right; font-weight: 700;">$${order.shippingPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 8px 0; color: #718096; text-align: right; font-size: 14px;">Tax:</td>
                <td style="padding: 8px 0; color: #2d3748; text-align: right; font-weight: 700;">$${order.taxPrice.toFixed(2)}</td>
              </tr>
              <tr style="border-top: 2px solid #e2e8f0;">
                <td colspan="2" style="padding: 16px 0 0 0; color: #2d3748; text-align: right; font-weight: 800; font-size: 18px;">Total Paid:</td>
                <td style="padding: 16px 0 0 0; color: #1f8044; text-align: right; font-weight: 800; font-size: 22px;">$${order.totalPrice.toFixed(2)}</td>
              </tr>
            </table>

            <!-- Shipping Details -->
            <div style="background-color: #f7fafc; border-radius: 16px; padding: 24px; border: 1px solid #edf2f7;">
              <h3 style="color: #2d3748; margin: 0 0 12px 0; font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Delivery Address</h3>
              <p style="color: #4a5568; margin: 0; font-size: 14px; line-height: 1.6;">
                <strong>${escapeHtml(order.shippingAddress.fullName)}</strong><br>
                ${escapeHtml(order.shippingAddress.address)}<br>
                ${escapeHtml(order.shippingAddress.city)}, ${escapeHtml(order.shippingAddress.postalCode)}<br>
                ${escapeHtml(order.shippingAddress.country)}<br>
                Phone: ${escapeHtml(order.shippingAddress.phone || 'N/A')}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f7fafc; padding: 24px; text-align: center; border-top: 1px solid #edf2f7;">
            <p style="color: #a0aec0; margin: 0; font-size: 12px;">© 2026 Amal Market. All rights reserved.</p>
            <p style="color: #a0aec0; margin: 4px 0 0 0; font-size: 11px;">If you have any questions, please reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Thank you for your purchase from Amal Market!

Order ID: #${orderIdUpper}
Customer: ${order.shippingAddress.fullName}

Items Purchased:
${order.orderItems.map(i => `- ${i.name} x ${i.quantity} ($${(i.price * i.quantity).toFixed(2)})`).join('\n')}

Subtotal: $${order.itemsPrice.toFixed(2)}
${order.discountPrice > 0 ? `Promo Discount: -$${order.discountPrice.toFixed(2)} (${order.couponCode})\n` : ''}Shipping Fee: $${order.shippingPrice.toFixed(2)}
Tax: $${order.taxPrice.toFixed(2)}
Total Paid: $${order.totalPrice.toFixed(2)}

Delivery Address:
${order.shippingAddress.fullName}
${order.shippingAddress.address}
${order.shippingAddress.city}, ${order.shippingAddress.postalCode}
${order.shippingAddress.country}
Phone: ${order.shippingAddress.phone || 'N/A'}

We are processing your order right now. You will receive an update when it ships!
    `;

    const mailOptions = {
      from: `"Amal Market" <${process.env.EMAIL_USER || 'no-reply@amalmarket.com'}>`,
      to: userEmail,
      subject: `Order Confirmation - #${orderIdUpper} - Thank you for your purchase!`,
      text: textContent,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📬 Order confirmation email sent successfully to ${userEmail}. MessageID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    return false;
  }
};

module.exports = {
  sendOrderConfirmationEmail
};
