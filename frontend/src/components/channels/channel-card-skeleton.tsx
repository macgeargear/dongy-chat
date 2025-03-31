import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function ChannelCardSkeleton() {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-2 w-full">
            <Skeleton className="h-4 w-1/2 rounded-sm" />

            <div className="flex items-center gap-2 flex-wrap">
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>

          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="p-1" disabled>
              <Skeleton className="h-4 w-4 rounded-full" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1" disabled>
              <Skeleton className="h-4 w-4 rounded-full" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1" disabled>
              <Skeleton className="h-4 w-4 rounded-full" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-xs">
          <Skeleton className="h-3 w-4" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Skeleton className="h-3 w-4" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}
