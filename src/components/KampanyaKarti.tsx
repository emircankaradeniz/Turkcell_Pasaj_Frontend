import { ReactNode } from "react";

interface KampanyaKartiProps {
  icon: ReactNode;
  title: string;
}

export default function KampanyaKarti({ icon, title }: KampanyaKartiProps) {
  return (
    <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow hover:shadow-md transition">
      <span className="text-blue-600 text-2xl">{icon}</span>
      <span className="font-medium">{title}</span>
    </div>
  );
}
