import { Loader2 } from "lucide-react";

export default function MainLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2
          className="size-6 animate-spin text-brand-terracotta dark:text-[#e0a48a]"
          aria-hidden="true"
        />
        <p className="text-sm" role="status">
          Opening the library&hellip;
        </p>
      </div>
    </div>
  );
}
