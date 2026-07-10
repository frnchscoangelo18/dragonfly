"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  updateEmail,
  updateUsername,
  updatePassword,
  signOut,
} from "@/lib/apis/auth/client";
import { useAuth } from "@/features/auth/store";

export function AccountModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { user, profile, refreshProfile } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleUpdateEmail() {
    if (!email) return;
    setLoading(true);
    try {
      await updateEmail(email);
      toast.success("Email update started. Check your inbox to confirm.");
      setEmail("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update email");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateUsername() {
    if (!username) return;
    setLoading(true);
    try {
      await updateUsername(username);
      await refreshProfile();
      toast.success("Username updated");
      setUsername("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update username");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePassword() {
    if (!password) return;
    setLoading(true);
    try {
      await updatePassword(password);
      toast.success("Password updated");
      setPassword("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update password");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch("/api/v2/auth/delete", { method: "POST" });
      if (!res.ok) throw new Error("Failed to delete account");
      toast.success("Account deleted. You have been signed out.");
      onOpenChange(false);
      await signOut();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete account");
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Account settings</DialogTitle>
            <DialogDescription>{user?.email}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="acc-email">Update email</Label>
              <div className="flex gap-2">
                <Input
                  id="acc-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={profile?.email ?? "new@email.com"}
                />
                <Button
                  onClick={handleUpdateEmail}
                  disabled={loading || !email}
                >
                  Save
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="acc-username">Update username</Label>
              <div className="flex gap-2">
                <Input
                  id="acc-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={profile?.username ?? "username"}
                />
                <Button
                  onClick={handleUpdateUsername}
                  disabled={loading || !username}
                >
                  Save
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="acc-password">Change password</Label>
              <div className="flex gap-2">
                <Input
                  id="acc-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <Button
                  onClick={handleUpdatePassword}
                  disabled={loading || !password}
                >
                  Save
                </Button>
              </div>
            </div>

            <div className="h-px bg-border" />

            <Button
              variant="destructive"
              onClick={() => setConfirmDelete(true)}
              type="button"
            >
              Delete account
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              Your account will be disabled and you'll be signed out. Your data
              is kept for record-keeping, but you won't be able to log in again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
