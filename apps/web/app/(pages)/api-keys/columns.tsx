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
import { useRevokeApiKey } from "@/hooks/useApiKeys";
import { ApiKey } from "@portfolio-types/shared";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { Ellipsis } from "lucide-react";

function RowActions({ row }: { row: ApiKey }) {
  const { mutate: revokeApiKey, isPending } = useRevokeApiKey();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
          <span className="sr-only">Open menu</span>
          <Ellipsis className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will revoke the API key <strong>{row.name}</strong>. It
                will no longer be usable for authentication.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={isPending}
                onClick={() => revokeApiKey(row.id)}
              >
                {isPending ? "Revoking..." : "Revoke"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<ApiKey>[] = [
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
  { header: "Key Name", accessorKey: "name" },
  {
    header: "Key Prefix",
    accessorKey: "keyPrefix",
    cell: ({ getValue }) => {
      const keyPrefix = getValue() as string;
      return <div className="font-mono">{`${keyPrefix}...`}</div>;
    },
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ getValue }) => {
      const formattedDate = formatDate(getValue() as string, "LLL d, yyyy");
      return <div>{formattedDate}</div>;
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => <RowActions row={row.original} />,
  },
];
