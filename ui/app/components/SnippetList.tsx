
interface Snippet {
  id: string;
  summary: string;
  text: string;
}

export default function SnippetList({
  snippets,
}: {
  snippets: Snippet[];
}) {
  return (
    <div className="w-full bg-[#22113a] p-6 overflow-y-auto border-r border-purple-900">
      <h2 className="text-lg font-semibold text-purple-300 mb-1">Your Snippets</h2>
      <div className="text-xs text-white opacity-60 mb-4">(click to see more)</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {snippets && snippets.length > 0 ? (
          snippets.map((snippet) => (
            <div
              key={snippet.id}
            >
              <div className="truncate text-base font-medium mb-1">{snippet.summary}</div>
              <div className="text-xs text-purple-300 truncate">{snippet.text.slice(0, 60)}...</div>
            </div>
          ))
        ) : (
          <div className="text-purple-400 text-sm">No snippets yet.</div>
        )}
      </div>
    </div>
  );
}
