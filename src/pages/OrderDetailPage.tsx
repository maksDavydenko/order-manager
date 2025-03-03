import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  status: string;
};

const statusSchema = Yup.object().shape({
  status: Yup.string()
    .oneOf(["pending", "paid", "shipped"])
    .required("requred"),
});

const fetchOrder = async (id: string): Promise<Product> => {
  const response = await fetch(`https://fakestoreapi.com/products/${id}`);
  if (!response.ok) {
    throw new Error("error");
  }
  return response.json();
};

const updateOrderStatus = async ({
  id,
  status,
}: {
  id: number;
  status: string;
}) => {
  const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error("error");
  }
  return response.json();
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: order,
    error,
    isLoading,
  } = useQuery<Product>({
    queryKey: ["order", id],
    queryFn: () => fetchOrder(id!),
  });

  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      navigate("/orders");
    },
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

  if (!order) {
    return <div className="text-center py-4">No order</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Details #{order.id}</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Staff:</h2>
        <img src={order.image} alt={order.title} width={200} height={200} />
        <p className="text-gray-600">title: {order.title}</p>
        <p className="text-gray-600">Desctiption: {order.description}</p>
        <p className="text-gray-600">Price: ${order.price}</p>
      </div>

      <Formik
        initialValues={{ status: order }}
        validationSchema={statusSchema}
        onSubmit={async () => {
          try {
            await updateStatus({ id: order.id, status: "status" });
          } catch (error) {
            console.error(error);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="status" className="block mb-2">
                Status:
              </label>
              <Field
                as="select"
                name="status"
                className="p-2 border rounded w-full"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
              </Field>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {isSubmitting ? "Saving..." : "Save changing"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
