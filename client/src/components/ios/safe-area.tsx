import { usePlatform } from "@/hooks/usePlatform";

interface SafeAreaProps {
  children: React.ReactNode;
  className?: string;
}

export default function SafeArea({ children, className = "" }: SafeAreaProps) {
  const { isIOS, hasNotch } = usePlatform();

  const safeAreaClasses = isIOS ? [
    hasNotch ? "pt-safe-top pb-safe-bottom" : "pt-4 pb-4",
    "px-safe-left pr-safe-right"
  ].join(" ") : "";

  return (
    <div className={`${safeAreaClasses} ${className}`}>
      {children}
    </div>
  );
}