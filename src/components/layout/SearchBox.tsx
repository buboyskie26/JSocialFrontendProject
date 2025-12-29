import { useState } from "react";
import { useDebouncedSearch } from "./useDebouncedSearch";
import axios from "../../utils/axiosConfig";

// EXAMPLE API function
async function getAllUsersBySearch(query: string, signal: AbortSignal) {
  //   const res = await fetch(`https://your-api.com/users?search=${query}`, {
  //     signal,
  //   });
  const response = await axios.get("/auth/getAllUsersBySearch", {
    params: query,
    signal
  });
  return response.data;
}

export default function SearchBox() {
  const [searchText, setSearchText] = useState("");

  const { data, isTyping, isLoading } = useDebouncedSearch(
    searchText,
    600, // debounce delay
    getAllUsersBySearch()
  );

  return (
    <div style={{ width: 300, position: "relative" }}>
      <input
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search users..."
        style={{
          width: "100%",
          paddingLeft: 36,
          paddingRight: 10,
          height: 38,
          borderRadius: 8,
        }}
      />

      {/* ICON LOGIC */}
      <div
        style={{
          position: "absolute",
          top: 9,
          left: 10,
        }}
      >
        {isTyping && searchText.length > 1 ? (
          <span>⌛</span> // Typing + waiting for debounce
        ) : isLoading ? (
          <span>🔄</span> // Fetching data
        ) : (
          <span>🔍</span> // Default search icon
        )}
      </div>

      {/* RESULT UI */}
      {data && (
        <div style={{ marginTop: 10 }}>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
