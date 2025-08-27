import { Server } from "@shared/schema";
import { appwriteService } from "@/lib/appwriteService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface DeleteServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  server: Server | null;
}

export function DeleteServerModal({ isOpen, onClose, onDelete, server }: DeleteServerModalProps) {
  const handleDelete = async () => {
    if (server) {
      await appwriteService.deleteServer(server.id);
      onDelete();
    }
  };

  if (!server) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent data-testid="modal-delete-server">
        <AlertDialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg font-semibold text-foreground">
                Delete Server
              </AlertDialogTitle>
              <p className="text-sm text-muted-foreground">This action cannot be undone</p>
            </div>
          </div>
          <AlertDialogDescription className="text-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold" data-testid="delete-server-name">
              {server.name}
            </span>
            ? All associated service information will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel data-testid="button-cancel-delete">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            data-testid="button-confirm-delete"
          >
            Delete Server
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
