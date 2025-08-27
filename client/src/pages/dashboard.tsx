import { useState, useMemo, useEffect } from "react";
import { Server } from "@shared/schema";
import { appwriteService } from "@/lib/appwriteService";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ServerCard } from "@/components/server-card";
import { AddEditServerModal } from "@/components/add-edit-server-modal";
import { DeleteServerModal } from "@/components/delete-server-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Server as ServerIcon, LogOut, Filter, X, ArrowUpDown, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [servers, setServers] = useState<Server[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<Server | null>(null);
  const [deletingServer, setDeletingServer] = useState<Server | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  // Get unique providers for filter
  const availableProviders = useMemo(() => {
    const providers = servers
      .map(server => server.provider)
      .filter(Boolean) // Remove null, undefined, and empty strings
      .filter((provider): provider is string => typeof provider === 'string' && provider.trim() !== '')
      .filter((provider, index, arr) => arr.indexOf(provider) === index)
      .sort();
    return providers;
  }, [servers]);

  const filteredServers = useMemo(() => {
    let filtered = servers;
    
    // Filter by provider first
    if (selectedProvider && selectedProvider !== "all") {
      filtered = filtered.filter(server => server.provider === selectedProvider);
    }
    
    // Then apply search filter
    if (searchQuery) {
      filtered = appwriteService.searchServers(filtered, searchQuery);
    }
    
    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "created") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "services") {
        return b.services.length - a.services.length;
      }
      return 0;
    });
    
    return filtered;
  }, [servers, searchQuery, selectedProvider, sortBy]);

  useEffect(() => {
    loadServers();
  }, []);

  const loadServers = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const serverList = await appwriteService.getServers(user.$id);
      setServers(serverList);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load servers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddServer = () => {
    setIsAddModalOpen(true);
  };

  const handleEditServer = (server: Server) => {
    setEditingServer(server);
  };

  const handleDeleteServer = (server: Server) => {
    setDeletingServer(server);
  };

  const handleServerSaved = async () => {
    await loadServers();
    setIsAddModalOpen(false);
    setEditingServer(null);
    toast({
      title: "Success",
      description: "Server saved successfully",
    });
  };

  const handleServerDeleted = async () => {
    await loadServers();
    setDeletingServer(null);
    toast({
      title: "Success",
      description: "Server deleted successfully",
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ServerIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">VPS Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-muted-foreground text-sm">
                {(selectedProvider && selectedProvider !== "all") || searchQuery ? (
                  <>
                    <span data-testid="filtered-server-count">{filteredServers.length}</span> of <span data-testid="total-server-count">{servers.length}</span> servers
                    {selectedProvider && selectedProvider !== "all" && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {selectedProvider}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span data-testid="server-count">{servers.length}</span> servers managed
                  </>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-9 w-9 p-0"
                data-testid="button-toggle-theme"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={user?.name || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search servers by name, IP, provider, or service..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="search-input"
            />
          </div>
          
          {/* Provider Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger className="w-48" data-testid="select-provider-filter">
                <SelectValue placeholder="Filter by Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" data-testid="select-all-providers">
                  All Providers
                </SelectItem>
                {availableProviders.map((provider) => (
                  <SelectItem key={provider} value={provider!} data-testid={`select-provider-${provider}`}>
                    {provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {((selectedProvider && selectedProvider !== "all") || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedProvider("all");
                  setSearchQuery("");
                }}
                className="h-8 w-8 p-0"
                data-testid="button-clear-filters"
                title="Clear all filters"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44" data-testid="select-sort-by">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created" data-testid="select-sort-created">
                  添加时间
                </SelectItem>
                <SelectItem value="services" data-testid="select-sort-services">
                  Services 数量
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleAddServer}
            className="flex items-center gap-2 whitespace-nowrap"
            data-testid="button-add-server"
          >
            <Plus className="w-4 h-4" />
            Add Server
          </Button>
        </div>

        {/* Server Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-card rounded-lg border border-border p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredServers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="server-grid">
            {filteredServers.map((server) => (
              <ServerCard
                key={server.id}
                server={server}
                onEdit={handleEditServer}
                onDelete={handleDeleteServer}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16" data-testid="empty-state">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-lg flex items-center justify-center">
              <ServerIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery ? "No servers found" : "No servers yet"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? "Try adjusting your search criteria" 
                : "Get started by adding your first VPS server to the dashboard."
              }
            </p>
            {!searchQuery && (
              <Button 
                onClick={handleAddServer}
                data-testid="button-add-first-server"
              >
                Add Your First Server
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <AddEditServerModal
        isOpen={isAddModalOpen || editingServer !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingServer(null);
        }}
        onSave={handleServerSaved}
        server={editingServer}
      />

      <DeleteServerModal
        isOpen={deletingServer !== null}
        onClose={() => setDeletingServer(null)}
        onDelete={handleServerDeleted}
        server={deletingServer}
      />
    </div>
  );
}
