import { useState } from "react";
import { Server } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Server as ServerIcon, 
  Monitor, 
  Building2, 
  MapPin, 
  Edit, 
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ServerCardProps {
  server: Server;
  onEdit: (server: Server) => void;
  onDelete: (server: Server) => void;
}

export function ServerCard({ server, onEdit, onDelete }: ServerCardProps) {
  const { toast } = useToast();
  const [servicesExpanded, setServicesExpanded] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `IP address ${text} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };
  return (
    <Card className="hover:shadow-lg transition-shadow" data-testid={`card-server-${server.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ServerIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground" data-testid={`text-server-name-${server.id}`}>
                {server.name}
              </h3>
              {server.ip && (
                <div 
                  className="flex items-center gap-1 group/ip cursor-pointer"
                  onClick={() => copyToClipboard(server.ip!)}
                  data-testid={`button-copy-ip-${server.id}`}
                >
                  <p className="text-sm text-muted-foreground group-hover/ip:text-foreground transition-colors" data-testid={`text-server-ip-${server.id}`}>
                    {server.ip}
                  </p>
                  <Copy className="w-3 h-3 text-muted-foreground group-hover/ip:text-foreground opacity-0 group-hover/ip:opacity-100 transition-all" />
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(server)}
              className="h-8 w-8 p-0"
              data-testid={`button-edit-${server.id}`}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(server)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              data-testid={`button-delete-${server.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {server.os && (
            <div className="flex items-center gap-2 text-sm">
              <Monitor className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{server.os}</span>
            </div>
          )}
          {server.provider && (
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{server.provider}</span>
            </div>
          )}
          {server.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{server.location}</span>
            </div>
          )}
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm text-foreground">Services</h4>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setServicesExpanded(!servicesExpanded)}
              className="h-6 px-2 text-xs flex items-center gap-1"
              data-testid={`button-toggle-services-${server.id}`}
            >
              {server.services.length} services
              {servicesExpanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </Button>
          </div>
          
          {server.services.length > 0 ? (
            <div className="space-y-2">
              {servicesExpanded ? (
                // Show all services when expanded
                server.services.map((service) => (
                  <div 
                    key={service.id} 
                    className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-md"
                    data-testid={`service-item-${service.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{service.name}</p>
                        {service.description && (
                          <p className="text-xs text-muted-foreground truncate">{service.description}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono flex-shrink-0 ml-2">{service.port}</span>
                  </div>
                ))
              ) : (
                // Show only first 3 services when collapsed
                server.services.slice(0, 3).map((service) => (
                  <div 
                    key={service.id} 
                    className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-md"
                    data-testid={`service-item-${service.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{service.name}</p>
                        {service.description && (
                          <p className="text-xs text-muted-foreground truncate">{service.description}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono flex-shrink-0 ml-2">{service.port}</span>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="text-center py-2 text-muted-foreground text-sm">
              No services configured
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
