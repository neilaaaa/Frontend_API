import { useEffect, useState } from "react";
import "./UserForm.css";

const emptyForm = {
  username: "",
  email: "",
  role: "",
  password: "",
  is_active: true,
};

function mapEditData(editData) {
  if (!editData) return emptyForm;

  return {
    username: editData.username || "",
    email: editData.email || "",
    role:
      editData.role === "Sans role"
        ? ""
        : editData.role === "Admin"
          ? "admin"
          : editData.role?.toLowerCase() || "",
    password: "",
    is_active: editData.is_active ?? true,
  };
}

export default function UserForm({ onSubmit, editData, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm(mapEditData(editData));
  }, [editData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const buildPayload = () => {
    const payload = {
      username: form.username.trim(),
      email: form.email.trim(),
      is_active: form.is_active,
    };

    if (form.password.trim()) {
      payload.password = form.password;
    }

    if (form.role === "admin") {
      payload.is_staff = true;
      payload.is_superuser = true;
      payload.groups = [];
    } else {
      payload.is_staff = false;
      payload.is_superuser = false;
      payload.groups = form.role ? [form.role] : [];
    }

    return payload;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(buildPayload());

    if (!editData) {
      setForm(emptyForm);
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    onCancel?.();
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h3>{editData ? "Modifier utilisateur" : "Ajouter utilisateur"}</h3>

      <label className="user-form-label" htmlFor="admin-username">Username</label>
      <input
        id="admin-username"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
      />

      <label className="user-form-label" htmlFor="admin-email">Email</label>
      <input
        id="admin-email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <label className="user-form-label" htmlFor="admin-role">Role</label>
      <select id="admin-role" name="role" value={form.role} onChange={handleChange}>
        <option value="">Role</option>
        <option value="admin">Admin</option>
        <option value="agent">Agent</option>
        <option value="responsable">Responsable</option>
        <option value="directeur">Directeur</option>
      </select>

      <label className="user-form-check">
        <input
          type="checkbox"
          name="is_active"
          checked={form.is_active}
          onChange={handleChange}
        />
        <span>Compte actif</span>
      </label>

      <label className="user-form-label" htmlFor="admin-password">
        {editData ? "Nouveau mot de passe" : "Mot de passe"}
      </label>
      <input
        id="admin-password"
        type="password"
        name="password"
        placeholder={editData ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
        value={form.password}
        onChange={handleChange}
        required={!editData}
      />

      <button type="submit">
        {editData ? "Modifier" : "Ajouter"}
      </button>

      {editData && (
        <button type="button" className="cancel-btn" onClick={handleCancel}>
          Annuler
        </button>
      )}
    </form>
  );
}
