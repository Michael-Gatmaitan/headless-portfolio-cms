"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useDeleteJob } from "@/hooks/useJobs";
import { Job } from "@portfolio-types/shared";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { Ellipsis, Trash2 } from "lucide-react";
import { EditJobDialog } from "@/components/layout/job-tracker/EditJobDialog";
import { useState } from "react";

const StatusBadge = ({ status }: { status: string }) => {
  const normalized = status.toLowerCase();
  if (normalized === "accepted") {
    return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">Accepted</Badge>;
  }
  if (normalized === "offered") {
    return <Badge className="bg-violet-500/10 text-violet-500 border-violet-500/20 hover:bg-violet-500/20">Offered</Badge>;
  }
  if (normalized === "interviewing") {
    return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20">Interviewing</Badge>;
  }
  if (normalized === "rejected") {
    return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20">Rejected</Badge>;
  }
  return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">Applied</Badge>;
};

const RowActions = ({ row }: { row: Job }) => {
  const { mutate: deleteJob, isPending } = useDeleteJob();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <EditJobDialog job={row} />
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" disabled={isPending}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the job application for <strong>{row.companyName}</strong> (<strong>{row.role}</strong>) from your tracker.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={() => deleteJob(row.id)}
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const columns: ColumnDef<Job>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Company",
    accessorKey: "companyName",
    cell: ({ getValue }) => <div className="font-semibold">{getValue() as string}</div>,
  },
  {
    header: "Role",
    accessorKey: "role",
  },
  {
    header: "Location",
    accessorKey: "location",
    cell: ({ getValue }) => getValue() ? (getValue() as string) : <span className="text-muted-foreground/60 text-xs">N/A</span>,
  },
  {
    header: "Salary Range",
    accessorKey: "salaryRange",
    cell: ({ getValue }) => getValue() ? (getValue() as string) : <span className="text-muted-foreground/60 text-xs">N/A</span>,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
  },
  {
    header: "Platform",
    accessorKey: "platform",
    cell: ({ getValue }) => getValue() ? (getValue() as string) : <span className="text-muted-foreground/60 text-xs">N/A</span>,
  },
  {
    header: "Date Applied",
    accessorKey: "dateApplied",
    cell: ({ getValue }) => {
      try {
        const formattedDate = formatDate(new Date(getValue() as string), "LLL d, yyyy");
        return <div>{formattedDate}</div>;
      } catch {
        return <div>{getValue() as string}</div>;
      }
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => <RowActions row={row.original} />,
  },
];
