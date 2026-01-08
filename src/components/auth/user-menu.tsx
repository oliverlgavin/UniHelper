"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User, LogOut, Library } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/use-app-store";

interface UserMenuProps {
  user: {
    email?: string;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { enterLibrary } = useAppStore();

  const handleSignOut = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/");
    router.refresh();
  };

  const handleLibrary = () => {
    enterLibrary();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-card hover:bg-muted transition-colors"
      >
        <User size={18} />
        <span className="font-bold text-sm hidden md:inline">{user.email}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 rounded-xl bg-card border border-border shadow-lg overflow-hidden z-50"
          >
            <button
              onClick={handleLibrary}
              className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-2 font-medium"
            >
              <Library size={16} />
              My Library
            </button>
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-2 font-medium text-red-600"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
