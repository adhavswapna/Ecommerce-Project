export default function RatingStars({ rating }: { rating?: number }) {
  return <div>{`Rating: ${rating || 0} ⭐`}</div>;
}

