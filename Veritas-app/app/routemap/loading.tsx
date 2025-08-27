import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RouteMapLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6 max-w-6xl">
      <div className="space-y-2">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader>
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...Array(5)].map((_, j) => (
                  <Skeleton key={j} className="h-8 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
