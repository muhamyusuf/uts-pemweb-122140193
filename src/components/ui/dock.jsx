import { CalendarRange, Heart, Utensils } from "lucide-react";
import { Link } from "react-router";

import { Dock, DockIcon, DockItem, DockLabel } from "@/components/core/dock";

const dockItems = [
  {
    title: "Discover Recipes",
    icon: (
      <Utensils className="h-full w-full text-amber-700 dark:text-amber-200" />
    ),
    href: "/",
  },
  {
    title: "Saved Favorites",
    icon: <Heart className="h-full w-full text-rose-600 dark:text-rose-200" />,
    href: "/favorites",
  },
  {
    title: "Meal Planner",
    icon: (
      <CalendarRange className="h-full w-full text-emerald-700 dark:text-emerald-200" />
    ),
    href: "/planner",
  },
];

export function RecipeDock() {
  return (
    <div className="fixed bottom-2 left-1/2 max-w-full -translate-x-1/2 z-50">
      <Dock className="items-end pb-3">
        {dockItems.map((item) => (
          <Link key={item.title} to={item.href}>
            <DockItem className="aspect-square rounded-full bg-white/90 dark:bg-neutral-800">
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>{item.icon}</DockIcon>
            </DockItem>
          </Link>
        ))}
      </Dock>
    </div>
  );
}
