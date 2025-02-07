// hooks/usePusher.ts
import pusher from "@/pusher/pusherClient";
import { useEffect } from "react";

// Define the expected event structure.
type PusherEvent = {
  model: any;
  modelType: string;
  action: "created" | "updated" | "deleted";
};

export const usePusher = (
  modelType: string,
  callback: (action: PusherEvent["action"], data: any) => void
) => {
  useEffect(() => {
    const channel = pusher.subscribe("global-updates");

    // Define the event handler.
    const eventHandler = (event: PusherEvent) => {
      if (event.modelType === modelType) {
        callback(event.action, event.model);
      }
    };

    // Bind our event handler to the "model.updated" event.
    channel.bind("model.updated", eventHandler);

    // Cleanup: unbind only our event handler (do not disconnect the global connection)
    return () => {
      channel.unbind("model.updated", eventHandler);
      pusher.unsubscribe("global-updates");
    };
  }, [modelType, callback]);
};
