"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Add user form
  const [showAdd, setShowAdd] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [adding, setAdding] = useState(false);

  // Reset password
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function getToken() {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || "";
  }

  async function fetchUsers() {
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setError("");
    setSuccess("");
    try {
      const token = await getToken();
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newEmail, password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(`User ${newEmail} created successfully`);
      setNewEmail("");
      setNewPassword("");
      setShowAdd(false);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(user: User) {
    if (!confirm(`Remove ${user.email} from admin access? They will no longer be able to log in.`)) {
      return;
    }
    setError("");
    setSuccess("");
    try {
      const token = await getToken();
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(`${user.email} has been removed`);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove user");
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setResetting(true);
    setError("");
    setSuccess("");
    try {
      const token = await getToken();
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: resetUserId, password: resetPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const user = users.find((u) => u.id === resetUserId);
      setSuccess(`Password reset for ${user?.email || "user"}`);
      setResetUserId(null);
      setResetPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setResetting(false);
    }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "Never";
    return new Date(dateStr).toLocaleDateString("en-NZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted text-sm mt-1">
            Manage who has access to the admin panel.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-5 py-2 bg-sage text-background text-sm tracking-wider uppercase font-medium hover:bg-sage-dark transition-colors"
        >
          {showAdd ? "Cancel" : "Add User"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-4 mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-sage/10 border border-sage/30 text-sage text-sm p-4 mb-6">
          {success}
        </div>
      )}

      {/* Add User Form */}
      {showAdd && (
        <form
          onSubmit={handleAddUser}
          className="bg-card-bg border border-border p-6 mb-8"
        >
          <h2 className="text-lg font-bold mb-4">Add New Admin User</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-muted text-xs tracking-wider uppercase mb-1">
                Email
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                placeholder="user@example.com"
                className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-sage transition-colors"
              />
            </div>
            <div>
              <label className="block text-muted text-xs tracking-wider uppercase mb-1">
                Temporary Password
              </label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Min 8 characters"
                className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-sage transition-colors"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={adding}
            className="px-5 py-2 bg-sage text-background text-sm tracking-wider uppercase font-medium hover:bg-sage-dark transition-colors disabled:opacity-50"
          >
            {adding ? "Creating..." : "Create User"}
          </button>
        </form>
      )}

      {/* Reset Password Form */}
      {resetUserId && (
        <form
          onSubmit={handleResetPassword}
          className="bg-card-bg border border-border p-6 mb-8"
        >
          <h2 className="text-lg font-bold mb-4">
            Reset Password for{" "}
            {users.find((u) => u.id === resetUserId)?.email}
          </h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-muted text-xs tracking-wider uppercase mb-1">
                New Password
              </label>
              <input
                type="text"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Min 8 characters"
                className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-sage transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={resetting}
              className="px-5 py-2 bg-sage text-background text-sm tracking-wider uppercase font-medium hover:bg-sage-dark transition-colors disabled:opacity-50"
            >
              {resetting ? "Resetting..." : "Reset Password"}
            </button>
            <button
              type="button"
              onClick={() => {
                setResetUserId(null);
                setResetPassword("");
              }}
              className="px-5 py-2 text-muted text-sm tracking-wider uppercase hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Users List */}
      {loading ? (
        <p className="text-muted text-sm">Loading...</p>
      ) : (
        <div className="bg-card-bg border border-border">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border-b border-border last:border-b-0"
            >
              <div>
                <p className="text-sm font-medium">{user.email}</p>
                <p className="text-muted text-xs mt-1">
                  Last login: {formatDate(user.last_sign_in_at)} · Added:{" "}
                  {formatDate(user.created_at)}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setResetUserId(user.id);
                    setResetPassword("");
                  }}
                  className="text-muted text-xs tracking-wider uppercase hover:text-foreground transition-colors"
                >
                  Reset Password
                </button>
                <button
                  onClick={() => handleDelete(user)}
                  className="text-red-400 text-xs tracking-wider uppercase hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <p className="text-muted text-sm p-4">No users found.</p>
          )}
        </div>
      )}
    </div>
  );
}
