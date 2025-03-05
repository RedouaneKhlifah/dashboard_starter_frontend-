import Pusher from "pusher-js";

const pusher = new Pusher(process.env.NEXT_PUBLIC_REVERB_APP_KEY!, {
  cluster: "",
  wsHost: process.env.NEXT_PUBLIC_REVERB_HOST!,
  wsPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT!, 10), // Make sure this is an integer
  forceTLS: false, // Set this to `true` if you are using HTTPS
  disableStats: true, // Recommended for production
});

export default pusher;
