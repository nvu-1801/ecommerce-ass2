import ProductCard from "./ProductCard";

export default function ProductGrid({
  data,
  toVND,
}: {
  data: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string | null;
    createdAt: Date;
  }[];
  toVND: (n: number) => string;
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.map((p) => (
        <ProductCard key={p.id} p={p} toVND={toVND} />
      ))}
    </div>
  );
}
