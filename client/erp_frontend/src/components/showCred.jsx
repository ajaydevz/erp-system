import toast from "react-hot-toast";

const showCred = () => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } fixed top-6 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <p className="text-base font-semibold text-gray-900 mb-3">🔑 Demo Credentials:</p>

        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Admin:</strong> admin | admin@123</p>
          <p><strong>Manager:</strong> manager | manager@123</p>
          <p><strong>Employee:</strong> user | user@123</p>
        </div>
      </div>

      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-xl p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  ));
};

export default showCred;
