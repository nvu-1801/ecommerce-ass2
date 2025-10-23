import { CartProvider } from "@/context/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
