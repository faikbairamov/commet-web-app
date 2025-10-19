import React, { useState, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import ApiService from "../services/api";
import type { User, CreateUserRequest } from "../types/index.js";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

interface UserManagementProps {
  className?: string;
}

const UserManagement: React.FC<UserManagementProps> = ({ className = "" }) => {
  const { state, setLoading, setError, clearError } = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<CreateUserRequest>({
    name: "",
    email: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await ApiService.getUsers();
      setUsers(response.users);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUser.name.trim() || !newUser.email.trim()) {
      setError("Name and email are required");
      return;
    }

    try {
      setIsCreating(true);
      clearError();
      const response = await ApiService.createUser(newUser);
      setUsers((prev) => [...prev, response.user]);
      setNewUser({ name: "", email: "" });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create user"
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
    clearError();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          User Management
        </h2>
        <p className="text-gray-300 mb-6">
          Manage users in the system. This demonstrates the user management API
          endpoints.
        </p>

        {/* Create User Form */}
        <form onSubmit={createUser} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
                placeholder="Enter user name"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                placeholder="Enter user email"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isCreating || state.isLoading}
            className="bg-primary hover:bg-primary/90 disabled:bg-gray-600 text-primary-foreground font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
          >
            {isCreating ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Creating User...
              </>
            ) : (
              "Create User"
            )}
          </button>
        </form>

        {state.error && (
          <div className="mb-4">
            <ErrorMessage error={state.error} onRetry={clearError} />
          </div>
        )}

        {/* Users List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Users</h3>
            <button
              onClick={fetchUsers}
              disabled={state.isLoading}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              Refresh
            </button>
          </div>

          {state.isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No users found</div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-gray-800 rounded-md p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="text-white font-medium">{user.name}</div>
                    <div className="text-gray-400 text-sm">{user.email}</div>
                  </div>
                  <div className="text-gray-500 text-sm">ID: {user.id}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
