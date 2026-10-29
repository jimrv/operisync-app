"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NuevoRegistro() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "incidencia",
    prioridad: "media",
    descripcion: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("registro_operativo").insert([
      {
        titulo: formData.titulo,
        tipo: formData.tipo,
        prioridad: formData.prioridad,
        estado: "pendiente",
        descripcion: formData.descripcion,
      },
    ]);

    setLoading(false);
    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white shadow-sm rounded-xl p-8 border border-slate-200">
        <div className="mb-6 flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Registrar Nueva Operación
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Ingresa los datos del reporte o proceso
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Volver
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Título del Reporte / Incidencia
            </label>
            <input
              type="text"
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
              placeholder="Ej. Falla en servidor principal o Baja de personal"
              value={formData.titulo}
              onChange={(e) =>
                setFormData({ ...formData, titulo: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Tipo de Registro
              </label>
              <select
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({ ...formData, tipo: e.target.value })
                }
              >
                <option value="incidencia">Incidencia</option>
                <option value="proceso">Proceso</option>
                <option value="baja">Baja</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Prioridad (IA Simulada)
              </label>
              <select
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
                value={formData.prioridad}
                onChange={(e) =>
                  setFormData({ ...formData, prioridad: e.target.value })
                }
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Descripción / Notas
            </label>
            <textarea
              rows={4}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm resize-none"
              placeholder="Detalles adicionales del proceso o incidencia..."
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-sm transition-all text-sm disabled:opacity-50"
          >
            {loading ? "Guardando registro..." : "Guardar Registro Operativo"}
          </button>
        </form>
      </div>
    </main>
  );
}
