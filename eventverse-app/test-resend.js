const { Resend } = require('resend');

const resend = new Resend('re_TzFpk5Ge_Jt83mj82JZFuSQYhQURk6bPn');

async function testEmail() {
  try {
    const data = await resend.emails.send({
      from: 'EventVerse <onboarding@resend.dev>',
      to: ['langanuruharitha@gmail.com'], // Assuming this is their email based on their repo name or they can change it
      subject: 'Test Email',
      html: '<p>This is a test.</p>'
    });
    console.log('Success:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testEmail();
