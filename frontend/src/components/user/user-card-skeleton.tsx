import { Card, CardContent, CardFooter } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function UserCardSkeleton() {
  return (
    <Card className="transition-shadow duration-200 border border-border/60 hover:shadow-lg rounded-xl overflow-hidden bg-background/80 backdrop-blur">
      <CardContent className="p-5 pb-3">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Skeleton className="h-16 w-16 rounded-full" />
            <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full bg-muted border-2 border-background" />
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-5 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>

          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 pt-2 bg-muted/20 border-t border-border/30">
        <div className="flex gap-2 w-full">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </CardFooter>
    </Card>
  );
}
