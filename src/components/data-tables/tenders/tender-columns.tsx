import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tender } from "@/definitions/tender-definitions";
import { Link } from "@tanstack/react-router";

export const tenderColumns: ColumnDef<Tender<string, string, string>>[] = [
  {
    accessorKey: "jail_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Jail Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "notice_number",
    header: "Notice Number",
  },
  {
    accessorKey: "tender_number",
    header: "Tender Number",
  },
  {
    accessorKey: "created_by",
    header: "Created By",
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));

      return (
        <div>
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const tender = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem>
              <Link
                to="/tenders/tender-details/$id/add-participants"
                params={{
                  id: tender.id,
                }}
              >
                Add Bidders / Participants
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Link
                to="/tenders/tender-details/$id"
                params={{
                  id: tender.id,
                }}
              >
                View Details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
