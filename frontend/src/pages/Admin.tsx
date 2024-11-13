import { useEffect, useState } from "react";
import axios from "axios";

interface Component {
  id: string;
  label: string;
}

export default function Admin() {
  const [page2Components, setPage2Components] = useState<Component[]>([]);
  const [page3Components, setPage3Components] = useState<Component[]>([]);
  const [unusedComponents, setUnusedComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPageComponents = async () => {
      setLoading(true);

      try {
        const page2Response = await axios.get("http://localhost:8000/api/pages/2/?format=json");
        const page3Response = await axios.get("http://localhost:8000/api/pages/3/?format=json");

        const page2Data = page2Response.data.components || [];
        const page3Data = page3Response.data.components || [];

        const allComponents = ["Birth date", "About me", "Address"];
        const assignedComponents = [...page2Data, ...page3Data];
        const unused = allComponents.filter((comp) => !assignedComponents.includes(comp));

        setPage2Components(page2Data.map((label: string) => ({ id: label.toLowerCase().replace(/\s+/g, ""), label })));
        setPage3Components(page3Data.map((label: string) => ({ id: label.toLowerCase().replace(/\s+/g, ""), label })));
        setUnusedComponents(unused.map((label: string) => ({ id: label.toLowerCase().replace(/\s+/g, ""), label })));
      } catch (error) {
        console.error("Error fetching page components:", error);
      }

      setLoading(false);
    };

    fetchPageComponents();
  }, []);

  const handleDragStart = (e: React.DragEvent, componentId: string) => {
    e.dataTransfer.setData("componentId", componentId);
  };

  const handleDrop = (e: React.DragEvent, target: "page2" | "page3" | "unused") => {
    e.preventDefault();
    const componentId = e.dataTransfer.getData("componentId");
    if (!componentId) return;

    let component = findComponent(componentId);
    if (!component) return;

    if (target === "page2") {
      if (page2Components.length === 1 && page2Components.some((comp) => comp.id === componentId)) {
        // Prevent drop if Page 2 already has only one component
        return;
      }

      if (!page2Components.some((comp) => comp.id === componentId)) {
        setPage2Components((prev) => [...prev, component]);
        removeFromOtherBuckets(componentId, "page2");
      }
    } else if (target === "page3") {
      if (page3Components.length === 1 && page3Components.some((comp) => comp.id === componentId)) {
        // Prevent drop if Page 3 already has only one component
        return;
      }

      if (!page3Components.some((comp) => comp.id === componentId)) {
        setPage3Components((prev) => [...prev, component]);
        removeFromOtherBuckets(componentId, "page3");
      }
    } else if (target === "unused") {
      setUnusedComponents((prev) => [...prev, component]);
      removeFromOtherBuckets(componentId, "unused");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFromOtherBuckets = (componentId: string, target: "page2" | "page3" | "unused") => {
    if (target !== "page2") setPage2Components((prev) => prev.filter((comp) => comp.id !== componentId));
    if (target !== "page3") setPage3Components((prev) => prev.filter((comp) => comp.id !== componentId));
    if (target !== "unused") setUnusedComponents((prev) => prev.filter((comp) => comp.id !== componentId));
  };

  const findComponent = (componentId: string): Component | undefined => {
    return (
      [...page2Components, ...page3Components, ...unusedComponents].find(
        (component) => component.id === componentId
      ) || undefined
    );
  };

  const saveConfig = async () => {
    // Check if both page2 and page3 have at least one component
    if (page2Components.length === 0 || page3Components.length === 0) {
      alert("Both Page 2 and Page 3 must have at least one component.");
      return;
    }

    try {
      await axios.put("http://localhost:8000/api/pages/2/", {
        components: page2Components.map((comp) => comp.label),
      });

      await axios.put("http://localhost:8000/api/pages/3/", {
        components: page3Components.map((comp) => comp.label),
      });

      alert("Configuration saved successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error saving configuration:", error);
      alert("Failed to save configuration.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Admin: Manage Page Configuration</h1>
      <div className="buckets">
        <div
          className="bucket"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "page2")}
        >
          <h3>Page 2</h3>
          {page2Components.map((component) => (
            <div
              key={component.id}
              className="draggable"
              draggable
              onDragStart={(e) => handleDragStart(e, component.id)}
            >
              {component.label}
            </div>
          ))}
        </div>

        <div
          className="bucket"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "page3")}
        >
          <h3>Page 3</h3>
          {page3Components.map((component) => (
            <div
              key={component.id}
              className="draggable"
              draggable
              onDragStart={(e) => handleDragStart(e, component.id)}
            >
              {component.label}
            </div>
          ))}
        </div>

        <div
          className="bucket"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "unused")}
        >
          <h3>Unused</h3>
          {unusedComponents.map((component) => (
            <div
              key={component.id}
              className="draggable"
              draggable
              onDragStart={(e) => handleDragStart(e, component.id)}
            >
              {component.label}
            </div>
          ))}
        </div>
      </div>

      <button onClick={saveConfig}>Save Configuration</button>
    </div>
  );
};
