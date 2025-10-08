"use client";

import { useRouter } from "next/navigation";

export default function NeedsLoginButton({
  label,
  className,
  message = "Bạn cần đăng nhập để thực hiện thao tác này.",
  goTo = "/signin",
}: {
  label: string;
  className?: string;
  message?: string;
  goTo?: string;
}) {
  const router = useRouter();

  const handleClick = () => {
    alert(message);
    router.push(goTo);
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {label}
    </button>
  );
}
