export default function StatCard({ label, value }) {
  return (
    <div className="bg-white shadow-md p-4 rounded-2xl text-center border-l-4 border-purple-400">
      <h3 className="text-xl font-semibold text-purple-700">{label}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );
}
