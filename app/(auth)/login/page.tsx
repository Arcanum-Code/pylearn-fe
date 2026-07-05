import { LoginForm, LoginBranding } from "@/features/auth";
import { LanguageSwitcher } from "@/features/layout/components/LanguageSwitcher";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen relative">
      {/* Left Pane: Developer Terminal Branding */}
      <div className="hidden md:flex flex-1 relative items-center justify-center bg-[#0F0F17] overflow-hidden">
        {/* Subtle radial glow for depth */}
        <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full w-[120%] h-[120%] -left-[10%] -top-[10%] pointer-events-none" />
        
        <LoginBranding />
      </div>
      
      {/* Right Pane: Login Form */}
      <div className="flex-1 flex items-center justify-center bg-grid px-4 py-12">
        <LoginForm />
      </div>

      {/* Floating Language Switcher button in bottom-left */}
      <div className="absolute bottom-8 left-8 z-50">
        <LanguageSwitcher />
      </div>
    </div>
  );
}
