import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { motion } from "framer-motion";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/dong-background.png')" }}
    >
      {/* Content */}
      <motion.div
        className="relative text-center space-y-6 p-8"
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 180 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-bold">Welcome to DongChat</h1>
        <p className="text-xl">Let's CHAT with your CHAD</p>

        {/* Buttons */}
        <div className="flex space-x-4 justify-center">
          <Link to="/chat/channel" className={cn(buttonVariants())}>
            Chat
          </Link>
          <Link to="/auth" className={cn(buttonVariants())}>
            Auth
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
