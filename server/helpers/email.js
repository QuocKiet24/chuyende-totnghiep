import sendEmail from "./sendEmail.js";

export const sendVerificationEmail = async (
  email,
  userName,
  verificationToken
) => {
  // send email
  const subject = "Email Verification - Nhom 4 E-shop";
  const send_to = email;
  const reply_to = "noreply@gmail.com";
  const template = "emailVerification";
  const send_from = process.env.USER_EMAIL;
  try {
    const response = await sendEmail({
      subject,
      send_to,
      send_from,
      reply_to,
      template,
      context: {
        name: userName,
        subject,
        code: verificationToken,
      },
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending verification`, error);

    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (resetToken, email, userName) => {
  // verification link
  const verificationLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // send email
  const subject = "Forgot Password - TaskManager";
  const send_to = email;
  const reply_to = "noreply@gmail.com";
  const template = "forgotPassword";
  const send_from = process.env.USER_EMAIL;
  try {
    const response = await sendEmail({
      subject,
      send_to,
      send_from,
      reply_to,
      template,
      context: {
        name: userName,
        link: verificationLink,
      },
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending verification`, error);

    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendOrderConfirmationEmail = async (
  email,
  userName,
  orderDetails
) => {
  const subject = `Order Confirmation #${orderDetails.orderId}`;
  const send_to = email;
  const reply_to = "noreply@eshop.com";
  const template = "orderConfirmation";
  const send_from = process.env.USER_EMAIL;

  try {
    const response = await sendEmail({
      subject,
      send_to,
      send_from,
      reply_to,
      template,
      context: {
        customerName: userName,
        ...orderDetails,
      },
    });
    console.log("Order confirmation email sent successfully", response);
    return response;
  } catch (error) {
    console.error("Error sending order confirmation email", error);
    throw new Error(`Error sending order confirmation email: ${error}`);
  }
};
