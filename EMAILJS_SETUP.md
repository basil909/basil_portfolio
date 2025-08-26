# EmailJS Setup Guide for Your Portfolio Contact Form

## 🚀 What We've Implemented

Your contact form is now set up to send emails directly to your Gmail using EmailJS. When someone fills out the form on your website, you'll receive an email with their message.

## 📋 Setup Steps

### 1. Create EmailJS Account
- Go to [https://www.emailjs.com/](https://www.emailjs.com/)
- Sign up for a free account (allows 200 emails/month)

### 2. Set Up Email Service
1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail** (or your preferred email provider)
4. Connect your Gmail account
5. Copy the **Service ID** (e.g., `service_abc123`)

### 3. Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template structure:

```html
Subject: New Message from Portfolio Website - {{user_name}}

Hello Basil,

You have received a new message from your portfolio website:

Name: {{user_name}}
Email: {{user_email}}
Message: {{message}}

Best regards,
Your Portfolio Website
```

4. Copy the **Template ID** (e.g., `template_xyz789`)

### 4. Get Your Public Key
1. Go to **Account** → **API Keys**
2. Copy your **Public Key** (e.g., `user_def456`)

### 5. Update Configuration
Open `src/config/emailjs.ts` and replace the placeholder values:

```typescript
export const emailjsConfig = {
    serviceId: 'service_abc123', // Your actual service ID
    templateId: 'template_xyz789', // Your actual template ID
    publicKey: 'user_def456', // Your actual public key
};
```

## 🔧 How It Works

1. **User fills form** → Name, email, and message
2. **Form submission** → EmailJS processes the form data
3. **Email sent** → You receive an email with the user's message
4. **Success/Error handling** → User sees appropriate feedback

## 📧 Form Field Mapping

The form fields are mapped to EmailJS template variables:
- `user_name` → Name field
- `user_email` → Email field  
- `message` → Message field

## 🎯 Features Added

- ✅ Real email functionality (no more simulation)
- ✅ Error handling with user-friendly messages
- ✅ Loading states during submission
- ✅ Success confirmation
- ✅ Form validation
- ✅ Responsive design

## 🚨 Important Notes

- **Free tier**: 200 emails/month
- **Security**: Your public key is safe to expose in frontend code
- **Testing**: Test with your own email first
- **Spam protection**: EmailJS includes basic spam filtering

## 🆘 Troubleshooting

If emails aren't working:
1. Check your EmailJS credentials
2. Verify your Gmail connection
3. Check browser console for errors
4. Ensure your Gmail allows "less secure apps" or use OAuth2

## 🔄 Next Steps

After setup:
1. Test the form with your own email
2. Customize the email template
3. Add any additional fields you want
4. Consider upgrading to paid plan if you expect high traffic

Your contact form is now fully functional and will send real emails to your Gmail! 🎉
