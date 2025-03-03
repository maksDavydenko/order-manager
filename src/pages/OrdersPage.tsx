import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";

type Products = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

const fetchProducts = async (): Promise<Products[]> => {
  const response = await fetch("https://fakestoreapi.com/products");
  if (!response.ok) {
    throw new Error("fetch error");
  }
  return response.json();
};

export default function OrdersPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "paid" | "shipped">(
    "all"
  );

  const { data, error, isLoading } = useQuery<Products[]>({
    queryKey: ["orders"],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">List</h1>

      <div className="mb-4">
        <label htmlFor="filter" className="mr-2">
          Filter
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "all" | "pending" | "paid" | "shipped")
          }
          className="p-2 border rounded"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
        </select>
      </div>

      <div className="space-y-4">
        {data &&
          data.map((product) => (
            <div key={product.id} className="p-4 border rounded shadow-sm">
              <img
                src={product.image}
                alt={product.title}
                width={200}
                height={200}
              />
              <p className="text-gray-600">title: {product.title}</p>
              <p className="text-gray-600">
                Desctiption: {product.description}
              </p>
              <p className="text-gray-600">Price: ${product.price}</p>
              <Link
                to={`/orders/${product.id}`}
                className="text-blue-500 hover:underline"
              >
                Product #{product.id}
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
