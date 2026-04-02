import { MOCK_PROTOTYPES } from "@/lib/mock-data";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hammer } from "lucide-react";

export default async function PlaygroundPage() {
  const prototypes = MOCK_PROTOTYPES;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Prototype Playground</h1>
          <p className="text-muted-foreground mt-1">
            Build and test your ideas with AI assistance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prototypes.map((proto) => (
          <Link key={proto.id} href={`/playground/${proto.id}`}>
            <Card className="glass neon-border hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{proto.title}</CardTitle>
                  <Badge
                    variant={
                      proto.status === "ACTIVE" ? "default" : "secondary"
                    }
                  >
                    {proto.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {proto.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {proto.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-1">
                  {proto.techStack.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                {proto.sandbox && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        proto.sandbox.status === "RUNNING"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    />
                    Sandbox: {proto.sandbox.status.toLowerCase()}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}

        {prototypes.length === 0 && (
          <Card className="col-span-full border-dashed glass">
            <CardContent className="py-12 text-center space-y-4">
              <Hammer className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="font-semibold">No prototypes yet</h3>
                <p className="text-sm text-muted-foreground">
                  Create your first prototype to start building
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
