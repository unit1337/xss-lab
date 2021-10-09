import React from "react";
import "./App.css";

function App() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = e.currentTarget.elements.namedItem(
      "payload"
    ) as HTMLTextAreaElement;
    const domElement = payload?.value;
    const hackme = document.getElementById("hackme");
    if (hackme === null) return;
    hackme.innerHTML = domElement;
  };

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={onSubmit}>
          <textarea
            name="payload"
            placeholder="Hack the planet"
            style={{ width: "700px", height: "500px", display: "block" }}
          />
          <button type="submit">Hack</button>
        </form>
      </header>
    </div>
  );
}

export default App;
