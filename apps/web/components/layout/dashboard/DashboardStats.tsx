"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { FolderCode, Award, Wrench, ArrowRight } from "lucide-react";
import Link from "next/link";

const DashboardStats = () => {
  const { data: stats, isLoading, isError, error } = useDashboardStats();

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
        Error loading dashboard stats: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  const statCards = [
    {
      title: "Projects",
      value: stats?.projects ?? 0,
      description: "Showcase of your dev work",
      icon: FolderCode,
      color: "from-blue-500/10 to-indigo-500/10 text-blue-500 border-blue-500/20",
      iconBg: "bg-blue-500/10 text-blue-500",
      link: "/projects",
      linkLabel: "Manage projects",
    },
    {
      title: "Skills",
      value: stats?.skills ?? 0,
      description: "Your tech stack expertise",
      icon: Wrench,
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-500 border-emerald-500/20",
      iconBg: "bg-emerald-500/10 text-emerald-500",
      link: "/skills",
      linkLabel: "Manage skills",
    },
    {
      title: "Awards",
      value: stats?.awards ?? 0,
      description: "Achievements & certificates",
      icon: Award,
      color: "from-amber-500/10 to-orange-500/10 text-amber-500 border-amber-500/20",
      iconBg: "bg-amber-500/10 text-amber-500",
      link: "/awards",
      linkLabel: "Manage awards",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-10 rounded-lg" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-4 w-28" />
            </CardContent>
          </Card>
        ))
        : statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md border-foreground/10 hover:border-foreground/20"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
              />

              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    {card.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-0.5">
                    {card.description}
                  </CardDescription>
                </div>
                <div className={`p-2.5 rounded-xl ${card.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>

              <CardContent className="pt-2">
                <div className="text-4xl font-extrabold tracking-tight font-heading">
                  {card.value}
                </div>
                <div className="mt-4 flex items-center">
                  <Link
                    href={card.link}
                    className="inline-flex items-center text-sm font-medium text-foreground hover:underline group-hover:text-primary transition-colors gap-1"
                  >
                    {card.linkLabel}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
};

export default DashboardStats;
