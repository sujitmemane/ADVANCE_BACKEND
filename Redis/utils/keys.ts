export const getKeyName = (...args: string[]) => {
  return `bites:${args.join(":")}`;
};

export const getRestaurantKeyName = (restaurantId: string) =>
  getKeyName("restaurant", restaurantId);

export const getRestaurantReviewsId = (restaurantId: string) =>
  getKeyName("reviews", restaurantId);
export const reviewDetailsKeyById = (id: string) =>
  getKeyName("review_details", id);
