export default function ResourceCard({ res }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
      {res.thumbnail && <img src={res.thumbnail} alt={res.title} className="w-full h-40 object-cover" />}
      <div className="p-4">
        <h4 className="font-semibold text-purple-700 text-lg">{res.title}</h4>
        <p className="text-sm text-gray-600 mb-2">{res.description}</p>
        <a href={res.url} target="_blank" rel="noreferrer"
           className="text-sm inline-block text-emerald-600 hover:underline">
          Open {res.category}
        </a>
      </div>
    </div>
  );
}
