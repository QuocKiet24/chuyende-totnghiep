import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { Separator } from "@/components/ui/separator";
import { Github, Instagram, Mail } from "lucide-react";

const footerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function ShoppingFooter() {
  return (
    <motion.footer
      className="w-full bg-gray-50 border-t py-6 px-4 text-center"
      variants={footerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center space-y-4">
        <Separator className="w-full" />
        <div className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Nhom4. All rights reserved.
        </div>

        <div className="flex gap-4 text-gray-600">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-5 h-5 hover:text-black transition-colors" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram className="w-5 h-5 hover:text-pink-500 transition-colors" />
          </a>
          <a href="mailto:support@shoppingzone.com">
            <Mail className="w-5 h-5 hover:text-blue-500 transition-colors" />
          </a>
        </div>
      </div>
    </motion.footer>
  );
}
