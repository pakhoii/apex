import { Separator } from "@/components/ui/separator";
import { Github, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-10">
      <div className="container mx-auto px-4 py-8">
        <Separator className="mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Your Company Name. All rights reserved.
          </p>
          <div className="flex space-x-4">
            {/* Example social links using shadcn Button component and Lucide icons */}
            <a
              href="#"
              className="text-gray-400 hover:text-gray-700 transition duration-150"
              aria-label="GitHub"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-700 transition duration-150"
              aria-label="Twitter"
            >
              <Twitter className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
