export default function SelfHealTools({ mood }) {
  const resourceMap = {
    happy: [
      { title: "Gratitude Journaling", link: "https://www.healthline.com/health/gratitude-journal" },
      { title: "Spread Kindness Challenge", link: "https://www.randomactsofkindness.org/" },
    ],
    self: [
      { title: "Mindful Breathing Exercise", link: "https://www.headspace.com/mindfulness" },
      { title: "Self-reflection Prompts", link: "https://positivepsychology.com/self-reflection/" },
    ],
    need: [
      { title: "Talk to Someone (Helplines)", link: "https://www.mentalhealth.gov/get-help/immediate-help" },
      { title: "Coping Strategies for Anxiety", link: "https://www.anxietycanada.com/" },
    ],
  };

  const resources = resourceMap[mood];

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-4">
      <h3 className="text-xl font-semibold text-purple-600 mb-2">📚 Personalized Self-Heal Tools</h3>

      {resources && resources.length > 0 ? (
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          {resources.map((r, i) => (
            <li key={i}>
              <a
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {r.title}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">
          No personalized resources yet. Try logging your mood to get tailored suggestions!
        </p>
      )}
    </div>
  );
}
