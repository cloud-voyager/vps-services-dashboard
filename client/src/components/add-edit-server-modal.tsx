import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Server,
  InsertServer,
  insertServerSchema,
  InsertService,
} from "@shared/schema";
import { appwriteService } from "@/lib/appwriteService";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";

interface AddEditServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  server?: Server | null;
}

export function AddEditServerModal({
  isOpen,
  onClose,
  onSave,
  server,
}: AddEditServerModalProps) {
  const [services, setServices] = useState<
    (InsertService & { tempId: string })[]
  >([]);
  const isEditing = !!server;
  const { user } = useAuth();
  // 用于引用对话框容器的 ref，实现自动滚动功能
  const dialogContentRef = useRef<HTMLDivElement>(null);

  const form = useForm<InsertServer>({
    resolver: zodResolver(insertServerSchema),
    defaultValues: {
      name: "",
      ip: "",
      os: "",
      provider: "",
      location: "",
      notes: "",
      services: [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (server) {
        form.reset({
          name: server.name,
          ip: server.ip,
          os: server.os || "",
          provider: server.provider || "",
          location: server.location || "",
          notes: server.notes || "",
          services: server.services,
        });
        setServices(
          server.services.map((service) => ({ ...service, tempId: service.id }))
        );
      } else {
        form.reset({
          name: "",
          ip: "",
          os: "",
          provider: "",
          location: "",
          notes: "",
          services: [],
        });
        setServices([
          { name: "", port: "", description: "", tempId: nanoid() },
        ]);
      }
    }
  }, [isOpen, server, form]);

  const addService = () => {
    setServices((prev) => [
      ...prev,
      { name: "", port: "", description: "", tempId: nanoid() },
    ]);

    // 添加服务后自动滚动到对话框底部
    setTimeout(() => {
      if (dialogContentRef.current) {
        dialogContentRef.current.scrollTo({
          top: dialogContentRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100); // 添加小延迟确保新服务已渲染
  };

  const removeService = (tempId: string) => {
    setServices((prev) => prev.filter((service) => service.tempId !== tempId));
  };

  const updateService = (
    tempId: string,
    field: keyof InsertService,
    value: string
  ) => {
    setServices((prev) =>
      prev.map((service) =>
        service.tempId === tempId ? { ...service, [field]: value } : service
      )
    );
  };

  const onSubmit = async (data: InsertServer) => {
    if (!user) return;

    // 只要服务名称不为空就认为是有效的服务，端口可以为空
    const validServices = services.filter((service) => service.name.trim());
    const serverData: InsertServer = {
      ...data,
      services: validServices.map(({ tempId, ...service }) => ({
        ...service,
        id: nanoid(),
      })),
    };

    try {
      if (isEditing && server) {
        await appwriteService.updateServer(server.id, serverData);
      } else {
        await appwriteService.addServer(user.$id, serverData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving server:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        ref={dialogContentRef}
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        data-testid="modal-server"
      >
        <DialogHeader>
          <DialogTitle data-testid="modal-title">
            {isEditing ? "Edit Server" : "Add New Server"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Server Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground border-b border-border pb-2">
                Server Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Server Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Production Blog"
                          {...field}
                          data-testid="input-server-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IP Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 103.117.100.199"
                          {...field}
                          data-testid="input-server-ip"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="os"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operating System</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Ubuntu 22.04"
                          {...field}
                          data-testid="input-server-os"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., BWG / DMIT / RackNerd"
                          {...field}
                          data-testid="input-server-provider"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Los Angeles, USA"
                        {...field}
                        data-testid="input-server-location"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes about this server..."
                        rows={3}
                        className="resize-none"
                        {...field}
                        data-testid="input-server-notes"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Services Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">Services</h3>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addService}
                  className="flex items-center gap-2"
                  data-testid="button-add-service"
                >
                  <Plus className="w-4 h-4" />
                  Add Service
                </Button>
              </div>

              <div className="space-y-3">
                {services.length > 0 ? (
                  services.map((service) => (
                    <div
                      key={service.tempId}
                      className="bg-muted/20 p-4 rounded-lg border border-border"
                      data-testid={`service-row-${service.tempId}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-1">
                                Service Name *
                              </label>
                              <Input
                                placeholder="e.g., Nginx"
                                value={service.name}
                                onChange={(e) =>
                                  updateService(
                                    service.tempId,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="text-sm"
                                data-testid={`input-service-name-${service.tempId}`}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-1">
                                Port(s)
                              </label>
                              <Input
                                placeholder="e.g., 80, 443"
                                value={service.port}
                                onChange={(e) =>
                                  updateService(
                                    service.tempId,
                                    "port",
                                    e.target.value
                                  )
                                }
                                className="text-sm"
                                data-testid={`input-service-port-${service.tempId}`}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                              Description
                            </label>
                            <Input
                              placeholder="Brief description of this service"
                              value={service.description || ""}
                              onChange={(e) =>
                                updateService(
                                  service.tempId,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="text-sm"
                              data-testid={`input-service-description-${service.tempId}`}
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeService(service.tempId)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 mt-6"
                          data-testid={`button-remove-service-${service.tempId}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    className="text-center py-8 text-muted-foreground"
                    data-testid="services-empty-state"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 opacity-50">
                      <Plus className="w-12 h-12" />
                    </div>
                    <p className="text-sm">No services added yet</p>
                    <p className="text-xs mt-1">
                      Click "Add Service" to get started
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Form Actions */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button type="submit" data-testid="button-submit">
                {isEditing ? "Update Server" : "Add Server"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
