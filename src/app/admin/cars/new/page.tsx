import CarForm from "@/components/CarForm";

export default function NewCarPage() {
  return (
    <div className="container-max py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Добавить авто</h1>
      <CarForm redirectTo="/admin" />
    </div>
  );
}
