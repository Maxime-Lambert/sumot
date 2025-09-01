import { cn } from "@/lib/utils";

type Tab = {
  key: string;
  label: string;
  count: number;
};

type FriendTabsProps = {
  tabs: Tab[];
  activeTab: string;
  onChange: (tab: string) => void;
};

export default function FriendTabs({
  tabs,
  activeTab,
  onChange,
}: FriendTabsProps) {
  return (
    <div className="flex justify-evenly mb-4 text-sm sm:text-base">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "px-2 sm:px-4 py-2 border-b-2 transition-colors",
            activeTab === tab.key
              ? "border-primary text-primary font-medium"
              : "border-transparent text-muted hover:text-foreground"
          )}
        >
          {tab.label}
          {tab.key === "received" && tab.count > 0 && (
            <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
              {tab.count}
            </span>
          )}
          {tab.key !== "received" && tab.count > 0 && (
            <span className="ml-1 text-primary-foreground">
              {"(" + tab.count + ")"}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
