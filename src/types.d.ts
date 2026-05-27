interface Window {
  ENV: {
    VITE_POSTHOG_KEY?: string;
    VITE_POSTHOG_HOST?: string;
    VITE_RAZORPAY_KEY_ID?: string;
    VITE_GOOGLE_CLIENT_ID?: string;
  };
  google?: any;
  Razorpay?: any;
}
