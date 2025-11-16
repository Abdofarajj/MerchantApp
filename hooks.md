React Hooks — The Essentials

Hooks are built-in functions in React that let you manage state, side effects, and reusable logic in functional components — without needing class components.

🔹 1. useState

Purpose: Manage component state (data that changes over time).

Example use case:

Tracking input values

Toggle buttons

UI flags like loading, errors, etc.

const [count, setCount] = useState(0);

You update state using setCount(newValue).
Re-renders happen automatically when state changes.

🔹 2. useEffect

Purpose: Handle side effects — things that happen outside the React render cycle.

Examples of side effects:

Fetching data from APIs

Subscribing/unsubscribing to a service

Running code after render

Syncing app state to localStorage

useEffect(() => {
fetchData();
return () => cleanup(); // optional cleanup on unmount
}, [dependencies]);

🧭 Dependency Array:

Empty [] → runs once (on mount).

With values [count] → runs when those values change.

Without array → runs on every render (rarely needed).

🔹 3. useMemo

Purpose: Optimize performance by caching computed values so they don’t re-run on every render.

Use it for expensive calculations that depend on specific values.

const total = useMemo(() => {
return items.reduce((sum, i) => sum + i.price, 0);
}, [items]);

✅ Use When:

You’re computing something heavy

You want to avoid recalculating unless data changes

🔹 4. useCallback

Purpose: Cache functions between renders to prevent unnecessary re-renders in child components.

const handleClick = useCallback(() => {
console.log("Clicked!");
}, []);

✅ Use When:

Passing a function as a prop to a child that uses React.memo()

Avoiding new function instances on every render

🧩 useCallback(fn, deps) is basically useMemo(() => fn, deps).

🔹 5. useRef

Purpose: Store mutable values that persist across renders without causing re-renders.

Common uses:

Accessing DOM elements

Keeping a previous value

Holding a timeout or WebSocket reference

const inputRef = useRef(null);

You can read or write inputRef.current directly.

🔹 6. useContext

Purpose: Share global state between multiple components without prop drilling.

Used with React’s Context API.

const user = useContext(UserContext);

✅ Use for:

Auth state

Theme

Language settings

Global configuration

🔹 7. useReducer

Purpose: Manage complex or related state logic (an alternative to multiple useStates).

Useful for forms, lists, or state with multiple transitions.

const [state, dispatch] = useReducer(reducer, initialState);

✅ Use When:

Your state has multiple interrelated fields

You want Redux-like behavior in a local component

🔹 8. useLayoutEffect

Purpose: Similar to useEffect, but runs synchronously after DOM mutations and before the browser repaints.

✅ Use only when you need layout measurements before the screen updates.

Example: measure element size before rendering something dependent on it.

🔹 9. Custom Hooks Pattern

Purpose: Create reusable hooks for complex logic, API calls, or state management.

Examples in this project:

- **useDeviceActivation**: Manages device toggle state with optimistic updates and React Query cache synchronization
- **usePosDetails**: Fetches POS device data with React Query
- **useHomeDetails**: Handles home screen data with SignalR integration

Example pattern:

const useCustomHook = (params) => {
const [state, setState] = useState(initial);
const queryClient = useQueryClient();

// Business logic here
const performAction = async () => {
// Optimistic update
setState(newState);

    try {
      await apiCall();
      // Sync global cache
      queryClient.setQueryData(['key'], updateFn);
    } catch (error) {
      // Revert on failure
      setState(oldState);
    }

};

return { state, performAction };
};

✅ Use When:

You want reusable logic (like fetching, validating, or connecting to APIs).

Combining multiple built-in hooks for specific business logic.

Maintaining data consistency across screens with cache updates.

⚙️ Summary Table
Hook Use For Causes Re-render Typical Use Case
useState Managing state ✅ Inputs, toggles
useEffect Side effects ❌ (unless it updates state) API calls, subscriptions
useMemo Cache computed value ❌ Expensive calculations
useCallback Cache function ❌ Memoized callbacks
useRef Mutable persistent value ❌ DOM refs, timers
useContext Global data access ✅ Auth, theme
useReducer Complex state logic ✅ Forms, dynamic UI
useLayoutEffect Post-DOM logic ❌ Layout measurements
