export default function DashboardNav({
  userEmail,
  onLogout,
  useStreaming,
  setUseStreaming,
}: {
  userEmail: string | undefined;
  onLogout: () => void;
  useStreaming: boolean;
  setUseStreaming: (v: boolean) => void;
}) {
  return (
    <nav className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-4 border-b border-purple-900 gap-2">
      <div className="text-lg sm:text-xl font-bold text-purple-200 text-center w-full sm:w-auto break-words">
        Welcome, {userEmail}!
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1 text-purple-200 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={useStreaming}
            onChange={() => setUseStreaming(!useStreaming)}
            className="accent-purple-700 mr-1"
          />
          Use Streaming
        </label>
        <button
          onClick={onLogout}
          className="bg-purple-700 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-purple-600 hover:text-purple-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
