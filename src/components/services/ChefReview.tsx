
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Star } from 'lucide-react';
import { useChefReviews } from '@/hooks/useChefs';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ChefReviewProps {
  chefId: string;
}

export const ChefReview: React.FC<ChefReviewProps> = ({ chefId }) => {
  const { data: reviews = [], isLoading, addReview } = useChefReviews(chefId);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleSubmit = async () => {
    await addReview.mutateAsync({ 
      chefId, 
      rating, 
      comment: comment.trim() || undefined 
    });
    setComment('');
    setRating(5);
    setIsDialogOpen(false);
  };
  
  const renderStars = (count: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={cn(
          "h-4 w-4", 
          i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        )} 
      />
    ));
  };
  
  return (
    <Card className="border-koffa-beige">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Customer Reviews</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="bg-koffa-green hover:bg-koffa-green-dark">
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
                <DialogDescription>
                  Share your experience with this chef to help other customers.
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex items-center justify-center my-4">
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "h-6 w-6 cursor-pointer transition-all", 
                      i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-200"
                    )}
                    onClick={() => setRating(i + 1)}
                  />
                ))}
              </div>
              
              <Textarea
                placeholder="Share details of your experience with this chef..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
              
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleSubmit} 
                  className="bg-koffa-green hover:bg-koffa-green-dark"
                  disabled={addReview.isPending}
                >
                  {addReview.isPending ? "Submitting..." : "Submit Review"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-koffa-green border-t-transparent mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No reviews yet. Be the first to review this chef!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="border-b border-koffa-beige/30 pb-4 last:border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-koffa-green/20 text-koffa-green">
                        {review.user_id.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
                {review.comment && (
                  <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {reviews.length > 0 && (
        <CardFooter className="pt-0 flex justify-center">
          <Button variant="link" className="text-koffa-green">
            See all {reviews.length} reviews
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
