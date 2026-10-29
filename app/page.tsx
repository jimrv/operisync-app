"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Dashboard() {
  const [registros, setRegistros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistros();
  }, []);

  async function fetchRegistros() {
    setLoading(true);
    const { data, error } = await supabase
      .from("registro_operativo")
      .select("*")
      .order("fecha_asignacion", { ascending: false });

    if (error) console.error("Error al cargar:", error);
    else setRegistros(data || []);
    setLoading(false);
  }

  async function cambiarEstado(id: string, estadoActual: string) {
    const siguienteEstado =
      estadoActual === "pendiente"
        ? "en_proceso"
        : estadoActual === "en_proceso"
          ? "resuelto"
          : "pendiente";
    const { error } = await supabase
      .from("registro_operativo")
      .update({ estado: siguienteEstado })
      .eq("id", id);

    if (!error) fetchRegistros();
  }

  async function eliminarRegistro(id: string) {
    const { error } = await supabase
      .from("registro_operativo")
      .delete()
      .eq("id", id);

    if (!error) fetchRegistros();
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              OperisSync B2B
            </h1>
            <p className="text-sm text-slate-600">
              Panel centralizado de incidencias, procesos y bajas corporativas
            </p>
          </div>
          <Link
            href="/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all text-sm"
          >
            + Nuevo Registro
          </Link>
        </div>

        {/* Tabla de Registros */}
        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 text-slate-700 uppercase text-xs font-semibold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Título / Descripción</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Prioridad</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {registros.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-4 max-w-xs">
                      <div className="font-semibold text-slate-900">
                        {item.titulo}
                      </div>
                      <div className="text-xs text-slate-500 truncate mt-0.5">
                        {item.descripcion || "Sin descripción detallada"}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border border-slate-200">
                        {item.tipo}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${
                          item.prioridad === "alta"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : item.prioridad === "media"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {item.prioridad}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => cambiarEstado(item.id, item.estado)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors capitalize"
                      >
                        {item.estado?.replace("_", " ")} 🔄
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => eliminarRegistro(item.id)}
                        className="text-rose-600 hover:text-rose-800 font-semibold text-xs px-3 py-1 rounded hover:bg-rose-50 transition-colors"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {registros.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-12 text-center text-slate-400 font-medium"
                    >
                      No hay registros operativos creados todavía. Haz clic en
                      "+ Nuevo Registro" para comenzar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
