import { useEffect, useState } from "react";

function Projects() {
  const token = localStorage.getItem("token");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    imageUrl: "",
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/projects",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      
      setProjects(data);
    } catch (error) {
      console.error(error);
      setMessage("Projects load nahi ho paaye");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      technologies: "",
      githubUrl: "",
      liveUrl: "",
      imageUrl: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const url = editingId
        ? `http://localhost:8080/api/projects/${editingId}`
        : "http://localhost:8080/api/projects";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log(errorText);
        throw new Error("Request failed");
      }

      setMessage(
        editingId
          ? "Project updated successfully"
          : "Project added successfully"
      );

      resetForm();
      fetchProjects();
    } catch (error) {
      console.error(error);
      setMessage("Project save nahi ho paaya");
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);

    setForm({
      title: project.title || "",
      description: project.description || "",
      technologies: project.technologies || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      imageUrl: project.imageUrl || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/projects/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setMessage("Project deleted successfully");

      fetchProjects();
    } catch (error) {
      console.error(error);
      setMessage("Project delete nahi ho paaya");
    }
  };

  return (
    <div>

      {/* Add / Edit Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">

        <div className="flex justify-between items-center mb-6">

          <h3 className="text-2xl font-semibold">
            {editingId ? "Edit Project" : "Add Project"}
          </h3>

          {editingId && (
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          )}

        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
          />

          <textarea
            name="description"
            placeholder="Project Description"
            value={form.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
          />

          <input
            type="text"
            name="technologies"
            placeholder="Technologies (Java, Spring Boot, React...)"
            value={form.technologies}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
          />

          <input
            type="text"
            name="githubUrl"
            placeholder="GitHub URL"
            value={form.githubUrl}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
          />

          <input
            type="text"
            name="liveUrl"
            placeholder="Live Project URL"
            value={form.liveUrl}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
          />

          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL / Image Name"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
          />

          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold"
          >
            {editingId ? "Update Project" : "Add Project"}
          </button>

        </form>

        {message && (
          <p className="mt-4 text-green-400">
            {message}
          </p>
        )}

      </div>


      {/* Projects List */}
      <div>

        <h3 className="text-2xl font-semibold mb-5">
          All Projects
        </h3>

        {loading ? (
          <p className="text-gray-400">
            Loading projects...
          </p>
        ) : projects.length === 0 ? (
          <p className="text-gray-400">
            No projects found.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">

            {projects.map((project) => (

              <div
                key={project.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6"
              >

                <h4 className="text-xl font-semibold">
                  {project.title}
                </h4>

                <p className="text-gray-400 mt-3">
                  {project.description}
                </p>

                <p className="text-blue-400 mt-4">
                  {project.technologies}
                </p>

                <div className="flex gap-3 mt-6">

                  <button
                    onClick={() => handleEdit(project)}
                    className="px-4 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(project.id)}
                    className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

function About() {
  const token = localStorage.getItem("token");
const [about, setAbout] = useState({
    name: "",
    title: "",
    description: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/about",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load about");
      }

      const data = await response.json();
      console.log("ABOUT DATA:", data);

      setAbout({
  name: data[0]?.name || "",
  title: data[0]?.title || "",
  description: data[0]?.description || "",
  profileImage: data[0]?.profileImage || "",
});
    } catch (error) {
      console.error(error);
      setMessage("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setAbout({
      ...about,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    console.log("UPDATE TOKEN:", token);

    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/about/2",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(about),
        }
      );

      if (!response.ok) {
  const errorText = await response.text();

  console.log("UPDATE STATUS:", response.status);
  console.log("UPDATE RESPONSE:", errorText);

  throw new Error("Update failed");
}

      setMessage("About updated successfully");

      fetchAbout();
    } catch (error) {
      console.error(error);
      setMessage("About update failed");
    }
  };

  if (loading) {
    return (
      <p className="text-gray-400">
        Loading About...
      </p>
    );
  }

  return (
    <div className="max-w-3xl">

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

        <h3 className="text-2xl font-semibold mb-6">
          About Management
        </h3>

        <form
          onSubmit={handleUpdate}
          className="space-y-5"
        >

          <div>
            <label className="block text-gray-300 mb-2">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={about.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={about.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={about.description}
              onChange={handleChange}
              rows="6"
              required
              className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Profile Image
            </label>

            <input
              type="text"
              name="profileImage"
              value={about.profileImage}
              onChange={handleChange}
              placeholder="Image URL / Image name"
              className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Update About
          </button>

        </form>

        {message && (
          <p className="mt-5 text-green-400">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

function Skills() {
  const token = localStorage.getItem("token");

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "",
    level: "",
    percentage: "",
  });

const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  });
};
const handleEdit = (skill) => {
  setForm({
    name: skill.name,
    category: skill.category,
    level: skill.level,
    percentage: skill.percentage,
  });

  setEditingId(skill.id);
};
const handleDelete = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/skills/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete skill");
    }

    setMessage("Skill deleted successfully");

    fetchSkills();
  } catch (error) {
    console.error(error);
    setMessage("Failed to delete skill");
  }
};
const handleSubmit = async (e) => {
  e.preventDefault();

  setMessage("");

  try {
    let url = "http://localhost:8080/api/skills";
    let method = "POST";

    if (editingId) {
      url = `http://localhost:8080/api/skills/${editingId}`;
      method = "PUT";
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        percentage: Number(form.percentage),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(errorText);
      throw new Error("Failed to save skill");
    }

    if (editingId) {
      setMessage("Skill updated successfully");
    } else {
      setMessage("Skill added successfully");
    }

    setForm({
      name: "",
      category: "",
      level: "",
      percentage: "",
    });

    setEditingId(null);

    fetchSkills();
  } catch (error) {
    console.error(error);
    setMessage("Failed to save skill");
  }
};
  const [editingId, setEditingId] = useState(null);
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/skills",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch skills");
      }

      const data = await response.json();

      console.log("SKILLS DATA:", data);

      setSkills(data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div>
    <h3 className="text-2xl font-semibold mb-6">
      Skills Management
    </h3>
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
  <h3 className="text-2xl font-semibold mb-6">
    Add Skill
  </h3>

   <form onSubmit={handleSubmit} className="space-y-4">
    <input
      type="text"
      name="name"
      placeholder="Skill Name"
      value={form.name}
      onChange={handleChange}
      required
      className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
    />

    <input
      type="text"
      name="category"
      placeholder="Category"
      value={form.category}
      onChange={handleChange}
      required
      className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
    />

    <input
      type="text"
      name="level"
      placeholder="Level (Beginner / Intermediate / Advanced)"
      value={form.level}
      onChange={handleChange}
      required
      className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
    />

    <input
      type="number"
      name="percentage"
      placeholder="Percentage"
      value={form.percentage}
      onChange={handleChange}
      required
      className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
    />

    <button
      type="submit"
      className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold"
    >
      {editingId ? "Update Skill" : "Add Skill"}
    </button>
  </form>
</div>

    {loading ? (
      <p className="text-gray-400">
        Loading skills...
      </p>
    ) : skills.length === 0 ? (
      <p className="text-gray-400">
        No skills found.
      </p>
    ) : (
      <div className="grid md:grid-cols-2 gap-6">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <h4 className="text-xl font-semibold">
              {skill.name}
            </h4>

            <p className="text-gray-400 mt-2">
              Category: {skill.category}
            </p>

            <p className="text-blue-400 mt-2">
              Level: {skill.level}
            </p>

            <p className="text-green-400 mt-2">
              Percentage: {skill.percentage}%
            </p>
            <div className="flex gap-3 mt-4">
  <button
    onClick={() => handleEdit(skill)}
    className="px-4 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-700"
  >
    Edit
  </button>
  <button
  onClick={() => handleDelete(skill.id)}
  className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
>
  Delete
</button>
</div>
          </div>
        ))}
      </div>
    )}
  </div>
);
}

function Experience() {
  const token = localStorage.getItem("token");

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
  company: "",
  role: "",
  description: "",
  startDate: "",
  endDate: "",
  technologies: "",
});

const [editingId, setEditingId] = useState(null);

  useEffect(() => {
  fetchExperiences();
}, []);

const fetchExperiences = async () => {
  try {
    setLoading(true);

    const response = await fetch(
      "http://localhost:8080/api/experience",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch experiences");
    }

    const data = await response.json();

    console.log("EXPERIENCE DATA:", data);

    setExperiences(data);
  } catch (error) {
    console.error(error);
    setMessage("Failed to load experiences");
  } finally {
    setLoading(false);
  }
};
const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  });
};
const handleEdit = (experience) => {
  setForm({
    company: experience.company,
    role: experience.role,
    description: experience.description,
    startDate: experience.startDate,
    endDate: experience.endDate,
    technologies: experience.technologies,
  });

  setEditingId(experience.id);
};
const handleDelete = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/experience/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete experience");
    }

    setMessage("Experience deleted successfully");

    fetchExperiences();
  } catch (error) {
    console.error(error);
    setMessage("Failed to delete experience");
  }
};
const handleSubmit = async (e) => {
  e.preventDefault();

  setMessage("");

  try {
    let url = "http://localhost:8080/api/experience";
let method = "POST";

if (editingId) {
  url = `http://localhost:8080/api/experience/${editingId}`;
  method = "PUT";
}

const response = await fetch(url, {
  method: method,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(form),
});

    if (!response.ok) {
      const errorText = await response.text();
      console.log(errorText);
      throw new Error("Failed to add experience");
    }

    if (editingId) {
  setMessage("Experience updated successfully");
} else {
  setMessage("Experience added successfully");
}

    setForm({
      company: "",
      role: "",
      description: "",
      startDate: "",
      endDate: "",
      technologies: "",
    });
setEditingId(null);
    fetchExperiences();
  } catch (error) {
    console.error(error);
    setMessage("Failed to add experience");
  }
};

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6">
        Experience Management
      </h3>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
  <h4 className="text-2xl font-semibold mb-6">
    Add Experience
  </h4>

  <form onSubmit={handleSubmit}
   className="space-y-4">
    <input
      type="text"
      name="company"
      placeholder="Company"
      value={form.company}
      onChange={handleChange}
      required
      className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
    />

    <input
      type="text"
      name="role"
      placeholder="Role"
      value={form.role}
      onChange={handleChange}
      required
      className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
    />

    <textarea
      name="description"
      placeholder="Description"
      value={form.description}
      onChange={handleChange}
      required
      rows="4"
      className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
    />

    <input
      type="text"
      name="startDate"
      placeholder="Start Date (e.g. 2025)"
      value={form.startDate}
      onChange={handleChange}
      required
      className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
    />

    <input
      type="text"
      name="endDate"
      placeholder="End Date (e.g. Present)"
      value={form.endDate}
      onChange={handleChange}
      required
      className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
    />

    <input
      type="text"
      name="technologies"
      placeholder="Technologies (e.g. Java, Spring Boot, React)"
      value={form.technologies}
      onChange={handleChange}
      required
      className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
    />

    <button
  type="submit"
  className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold"
>
  {editingId ? "Update Experience" : "Add Experience"}
</button>
  </form>
  {message && (
  <p className="mt-4 text-green-400">
    {message}
  </p>
)}
</div>
      {loading ? (
  <p className="text-gray-400">
    Loading experiences...
  </p>
) : experiences.length === 0 ? (
  <p className="text-gray-400">
    No experiences found.
  </p>
) : (
  <div className="grid md:grid-cols-2 gap-6">
    {experiences.map((experience) => (
      <div
        key={experience.id}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
      >
        <h4 className="text-xl font-semibold">
          {experience.role}
        </h4>

        <p className="text-blue-400 mt-2">
          {experience.company}
        </p>

        <p className="text-gray-400 mt-2">
          {experience.startDate} - {experience.endDate}
        </p>

        <p className="text-gray-300 mt-3">
          {experience.description}
        </p>

        <p className="text-green-400 mt-3">
          Technologies: {experience.technologies}
        </p>
        <button
  onClick={() => handleEdit(experience)}
  className="mt-4 px-4 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-700"
>
  Edit
</button>

<button
  onClick={() => handleDelete(experience.id)}
  className="mt-4 ml-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
>
  Delete
</button>
      </div>
    ))}
  </div>
)}
    </div>
  );
}

function Services() {
  const token = localStorage.getItem("token");

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    icon: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/services"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }

      const data = await response.json();

      console.log("SERVICES DATA:", data);

      setServices(data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (service) => {
    setForm({
      title: service.title,
      description: service.description,
      icon: service.icon,
    });

    setEditingId(service.id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/services/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete service");
      }

      setMessage("Service deleted successfully");

      fetchServices();
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete service");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      let url = "http://localhost:8080/api/services";
      let method = "POST";

      if (editingId) {
        url = `http://localhost:8080/api/services/${editingId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log(errorText);
        throw new Error("Failed to save service");
      }

      if (editingId) {
        setMessage("Service updated successfully");
      } else {
        setMessage("Service added successfully");
      }

      setForm({
        title: "",
        description: "",
        icon: "",
      });

      setEditingId(null);

      fetchServices();
    } catch (error) {
      console.error(error);
      setMessage("Failed to save service");
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6">
        Services Management
      </h3>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <h4 className="text-2xl font-semibold mb-6">
          {editingId ? "Edit Service" : "Add Service"}
        </h4>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="title"
            placeholder="Service Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
          />

          <textarea
            name="description"
            placeholder="Service Description"
            value={form.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
          />

          <input
            type="text"
            name="icon"
            placeholder="Icon (e.g. 💻)"
            value={form.icon}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
          />

          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold"
          >
            {editingId ? "Update Service" : "Add Service"}
          </button>

        </form>

        {message && (
          <p className="mt-4 text-green-400">
            {message}
          </p>
        )}
      </div>

      {loading ? (
        <p className="text-gray-400">
          Loading services...
        </p>
      ) : services.length === 0 ? (
        <p className="text-gray-400">
          No services found.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className="text-3xl">
                {service.icon}
              </div>

              <h4 className="text-xl font-semibold mt-3">
                {service.title}
              </h4>

              <p className="text-gray-300 mt-3">
                {service.description}
              </p>

              <button
                onClick={() => handleEdit(service)}
                className="mt-4 px-4 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-700"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(service.id)}
                className="mt-4 ml-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Testimonials() {
  const token = localStorage.getItem("token");

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    role: "",
    message: "",
    imageUrl: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/testimonials"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch testimonials");
      }

      const data = await response.json();

      setTestimonials(data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (testimonial) => {
    setForm({
      name: testimonial.name,
      role: testimonial.role,
      message: testimonial.message,
      imageUrl: testimonial.imageUrl || "",
    });

    setEditingId(testimonial.id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/testimonials/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete testimonial");
      }

      setMessage("Testimonial deleted successfully");

      fetchTestimonials();
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete testimonial");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      let url = "http://localhost:8080/api/testimonials";
      let method = "POST";

      if (editingId) {
        url = `http://localhost:8080/api/testimonials/${editingId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log(errorText);
        throw new Error("Failed to save testimonial");
      }

      setMessage(
        editingId
          ? "Testimonial updated successfully"
          : "Testimonial added successfully"
      );

      setForm({
        name: "",
        role: "",
        message: "",
        imageUrl: "",
      });

      setEditingId(null);

      fetchTestimonials();
    } catch (error) {
      console.error(error);
      setMessage("Failed to save testimonial");
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6">
        Testimonials Management
      </h3>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <h4 className="text-2xl font-semibold mb-6">
          {editingId ? "Edit Testimonial" : "Add Testimonial"}
        </h4>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
          />

          <input
            type="text"
            name="role"
            placeholder="Role"
            value={form.role}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
          />

          <textarea
            name="message"
            placeholder="Testimonial Message"
            value={form.message}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
          />

          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
          />

          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold"
          >
            {editingId ? "Update Testimonial" : "Add Testimonial"}
          </button>

        </form>

        {message && (
          <p className="mt-4 text-green-400">
            {message}
          </p>
        )}
      </div>

      {loading ? (
        <p className="text-gray-400">
          Loading testimonials...
        </p>
      ) : testimonials.length === 0 ? (
        <p className="text-gray-400">
          No testimonials found.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >

              {testimonial.imageUrl && (
                <img
                  src={testimonial.imageUrl}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}

              <h4 className="text-xl font-semibold mt-3">
                {testimonial.name}
              </h4>

              <p className="text-blue-400 mt-1">
                {testimonial.role}
              </p>

              <p className="text-gray-300 mt-3">
                {testimonial.message}
              </p>

              <button
                onClick={() => handleEdit(testimonial)}
                className="mt-4 px-4 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-700"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(testimonial.id)}
                className="mt-4 ml-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Blogs() {
  const token = localStorage.getItem("token");

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    imageUrl: "",
    category: "",
    publishedDate: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/blogs"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data = await response.json();

      setBlogs(data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (blog) => {
    setForm({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      imageUrl: blog.imageUrl || "",
      category: blog.category,
      publishedDate: blog.publishedDate,
    });

    setEditingId(blog.id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/blogs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      setMessage("Blog deleted successfully");

      fetchBlogs();
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete blog");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      let url = "http://localhost:8080/api/blogs";
      let method = "POST";

      if (editingId) {
        url = `http://localhost:8080/api/blogs/${editingId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log(errorText);
        throw new Error("Failed to save blog");
      }

      setMessage(
        editingId
          ? "Blog updated successfully"
          : "Blog added successfully"
      );

      setForm({
        title: "",
        slug: "",
        content: "",
        imageUrl: "",
        category: "",
        publishedDate: "",
      });

      setEditingId(null);

      fetchBlogs();
    } catch (error) {
      console.error(error);
      setMessage("Failed to save blog");
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6">
        Blogs Management
      </h3>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">

        <h4 className="text-2xl font-semibold mb-6">
          {editingId ? "Edit Blog" : "Add Blog"}
        </h4>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="title"
            placeholder="Blog Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
          />

          <input
            type="text"
            name="slug"
            placeholder="Slug"
            value={form.slug}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
          />

          <textarea
            name="content"
            placeholder="Blog Content"
            value={form.content}
            onChange={handleChange}
            required
            rows="6"
            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
          />

          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
          />

          <input
            type="date"
            name="publishedDate"
            value={form.publishedDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
          />

          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold"
          >
            {editingId ? "Update Blog" : "Add Blog"}
          </button>

        </form>

        {message && (
          <p className="mt-4 text-green-400">
            {message}
          </p>
        )}
      </div>

      {loading ? (
        <p className="text-gray-400">
          Loading blogs...
        </p>
      ) : blogs.length === 0 ? (
        <p className="text-gray-400">
          No blogs found.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">

          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >

              {blog.imageUrl && (
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}

              <h4 className="text-xl font-semibold mt-4">
                {blog.title}
              </h4>

              <p className="text-blue-400 mt-1">
                {blog.category}
              </p>

              <p className="text-gray-400 text-sm mt-1">
                {blog.publishedDate}
              </p>

              <p className="text-gray-300 mt-3">
                {blog.content}
              </p>

              <button
                onClick={() => handleEdit(blog)}
                className="mt-4 px-4 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-700"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(blog.id)}
                className="mt-4 ml-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

function Messages() {
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/contacts"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();

      setMessages(data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/contacts/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete message");
      }

      setMessage("Message deleted successfully");

      fetchMessages();
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete message");
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6">
        Messages Management
      </h3>

      {message && (
        <p className="text-green-400 mb-6">
          {message}
        </p>
      )}

      {loading ? (
        <p className="text-gray-400">
          Loading messages...
        </p>
      ) : messages.length === 0 ? (
        <p className="text-gray-400">
          No messages found.
        </p>
      ) : (
        <div className="space-y-6">

          {messages.map((contact) => (
            <div
              key={contact.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >

              <h4 className="text-xl font-semibold">
                {contact.name}
              </h4>

              <p className="text-blue-400 mt-1">
                {contact.email}
              </p>

              <p className="text-gray-300 font-semibold mt-4">
                {contact.subject}
              </p>

              <p className="text-gray-400 mt-2">
                {contact.message}
              </p>

              <button
                onClick={() => handleDelete(contact.id)}
                className="mt-5 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

function App() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [message, setMessage] = useState("");

  const [activePage, setActivePage] = useState("Dashboard");


  const handleLogin = async (e) => {

    e.preventDefault();

    setMessage("Logging in...");

    try {

      const response = await fetch(
        "http://localhost:8080/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      setLoggedIn(true);
      setMessage("");

    } catch (error) {

      console.error(error);
      setMessage("Server connection failed");

    }
  };


  const handleLogout = () => {

    localStorage.removeItem("token");

    setLoggedIn(false);

    setUsername("");
    setPassword("");
  };


  const menuItems = [
    "Dashboard",
    "About",
    "Skills",
    "Projects",
    "Experience",
    "Services",
    "Testimonials",
    "Blogs",
    "Messages",
  ];


  if (!loggedIn) {

    return (

      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">

        <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-8">

          <div className="text-center mb-8">

            <h1 className="text-3xl font-bold text-white">
              Portfolio CMS
            </h1>

            <p className="text-gray-400 mt-2">
              Admin Login
            </p>

          </div>


          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            <div>

              <label className="block text-gray-300 mb-2">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="Enter username"
                className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
                required
              />

            </div>


            <div>

              <label className="block text-gray-300 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white"
                required
              />

            </div>


            <button
              type="submit"
              className="w-full py-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700"
            >
              Login
            </button>

          </form>


          {message && (
            <p className="text-center text-red-400 mt-5">
              {message}
            </p>
          )}

        </div>

      </div>

    );
  }


  return (

    <div className="min-h-screen bg-gray-950 text-white flex">

      {/* Sidebar */}

      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-5">

        <h1 className="text-2xl font-bold mb-8">
          Portfolio CMS
        </h1>


        <nav className="space-y-2">

          {menuItems.map((item) => (

            <button
              key={item}
              onClick={() => setActivePage(item)}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                activePage === item
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item}
            </button>

          ))}

        </nav>


        <button
          onClick={handleLogout}
          className="w-full mt-8 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white"
        >
          Logout
        </button>

      </aside>


      {/* Main Content */}

      <main className="flex-1 p-8">

        <div className="mb-8">

          <h2 className="text-3xl font-bold">
            {activePage}
          </h2>

          <p className="text-gray-400 mt-2">
            Manage your portfolio content from here.
          </p>

        </div>


        {/* Dashboard */}

        {activePage === "Dashboard" && (

          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold">
                About
              </h3>

              <p className="text-gray-400 mt-2">
                Manage portfolio introduction.
              </p>
            </div>


            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

              <h3 className="text-xl font-semibold">
                Projects
              </h3>

              <p className="text-gray-400 mt-2">
                Manage your projects.
              </p>

            </div>


            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

              <h3 className="text-xl font-semibold">
                Blogs
              </h3>

              <p className="text-gray-400 mt-2">
                Manage blog articles.
              </p>

            </div>


            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

              <h3 className="text-xl font-semibold">
                Skills
              </h3>

              <p className="text-gray-400 mt-2">
                Manage technical skills.
              </p>

            </div>


            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

              <h3 className="text-xl font-semibold">
                Experience
              </h3>

              <p className="text-gray-400 mt-2">
                Manage experience and timeline.
              </p>

            </div>


            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

              <h3 className="text-xl font-semibold">
                Messages
              </h3>

              <p className="text-gray-400 mt-2">
                View contact messages.
              </p>

            </div>

          </div>

        )}


        {/* Projects */}

        {activePage === "Projects" && (
          <Projects />
        )}

        {/* About */}

{activePage === "About" && (
  <About />
)}
{/* Skills */}
{activePage === "Skills" && (
  <Skills />
)}

{/* Experience */}
{activePage === "Experience" && (
  <Experience />
)}

{/* Services */}
{activePage === "Services" && (
  <Services />
)}

{/* Testimonials */}
{activePage === "Testimonials" && (
  <Testimonials />
)}

{/* Blogs */}
{activePage === "Blogs" && (
  <Blogs />
)}

{/* Messages */}
{activePage === "Messages" && (
  <Messages />
)}

        {/* Other Pages */}

        {activePage !== "Dashboard" &&
          activePage !== "Projects" &&
           activePage !== "About" && 
           activePage !== "Skills" && 
           activePage !== "Experience" && 
            activePage !== "Services" &&
            activePage !== "Testimonials" && 
            activePage !== "Blogs" &&
            activePage !== "Messages" && (
        

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">

              <h3 className="text-2xl font-semibold">
                {activePage} Management
              </h3>

              <p className="text-gray-400 mt-3">
                CRUD management for {activePage} will be added here.
              </p>

            </div>

          )}

      </main>

    </div>

  );
}

export default App;