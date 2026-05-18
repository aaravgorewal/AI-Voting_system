import { Fingerprint } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-white/10 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-6 h-6 text-primary-500" />
            <span className="text-lg font-semibold tracking-tight text-gray-200">VoteAI</span>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} VoteAI Platform. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Help</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
