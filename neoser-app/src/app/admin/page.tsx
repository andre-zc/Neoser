"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  BarChart3,
  CalendarClock,
  ContactRound,
  Download,
  FileText,
  FilterX,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserPlus,
  UsersRound,
  X,
} from "lucide-react";

type CourseRelationship = "interes" | "inscrito";

interface LeadCourse {
  id: string;
  title: string;
  slug: string | null;
  relationship: CourseRelationship;
}

interface Lead {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  message: string;
  source: string;
  lead_status: string;
  status_updated_at: string;
  next_followup_at: string | null;
  assigned_to: string | null;
  wa_consent: boolean;
  wa_consent_at: string | null;
  identity_document: string | null;
  country_code: string | null;
  country: string | null;
  profession: string | null;
  workplace: string | null;
  service_interest: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  landing_path: string | null;
  created_at: string;
  courses: LeadCourse[];
}

interface LeadNote {
  id: string;
  body: string;
  created_at: string;
  profiles: { full_name: string } | null;
}

interface CourseOption {
  id: string;
  title: string;
  slug: string;
}

type OperationalStatus = "all" | "nuevo" | "propuesta_enviada" | "inscrito";
type AdminView = "contactos" | "campanas";

const SOURCE_LABELS: Record<string, string> = {
  meta_ads: "Meta Ads",
  google_ads: "Google Ads",
  instagram_organico: "Instagram orgánico",
  referida: "Referido",
  web: "Sitio web",
  whatsapp_button: "Botón de WhatsApp",
  newsletter: "Newsletter",
  course_enrollment: "Checkout del curso",
  paypal_internacional: "PayPal internacional",
  otro: "Otro",
};

const EDITABLE_STATUSES = [
  { value: "nuevo", label: "Nuevo" },
  { value: "propuesta_enviada", label: "Propuesta enviada" },
  { value: "inscrito", label: "Inscrito" },
] as const;

function sourceLabel(source: string) {
  return SOURCE_LABELS[source] || source.replaceAll("_", " ");
}

function operationalStatus(
  status: string,
): Exclude<OperationalStatus, "all"> | "archivado" {
  if (status === "propuesta_enviada") return "propuesta_enviada";
  if (status === "inscrito") return "inscrito";
  if (status === "perdido") return "archivado";
  return "nuevo";
}

function statusLabel(status: string) {
  const simplified = operationalStatus(status);
  if (simplified === "propuesta_enviada") return "Propuesta enviada";
  if (simplified === "inscrito") return "Inscrito";
  if (simplified === "archivado") return "Archivado";
  return "Nuevo";
}

function statusClass(status: string) {
  const simplified = operationalStatus(status);
  if (simplified === "inscrito") return "bg-emerald-50 text-emerald-700";
  if (simplified === "propuesta_enviada") return "bg-amber-50 text-amber-700";
  if (simplified === "archivado") return "bg-slate-100 text-slate-500";
  return "bg-blue-50 text-blue-700";
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtDateTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-PE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function inputDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function leadCourseNames(lead: Lead) {
  if (lead.courses.length) return lead.courses.map((course) => course.title);
  return lead.service_interest ? [lead.service_interest] : [];
}

function exportCSV(leads: Lead[]) {
  const headers = [
    "Nombre",
    "Email",
    "Teléfono",
    "DNI o documento",
    "País",
    "Profesión",
    "Centro laboral",
    "Cursos o intereses",
    "Fuente",
    "Estado",
    "Seguimiento",
    "Consentimiento WhatsApp",
    "Fecha consentimiento",
    "Creado",
  ];
  const rows = leads.map((lead) => [
    lead.full_name,
    lead.email || "",
    lead.phone,
    lead.identity_document || "",
    lead.country || "",
    lead.profession || "",
    lead.workplace || "",
    leadCourseNames(lead).join(" | "),
    sourceLabel(lead.source),
    statusLabel(lead.lead_status),
    lead.next_followup_at || "",
    lead.wa_consent ? "Sí" : "No",
    lead.wa_consent_at || "",
    lead.created_at,
  ]);
  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `contactos-neoser-${inputDate(new Date())}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminCRMPage() {
  const [view, setView] = useState<AdminView>("contactos");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [courseSaving, setCourseSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OperationalStatus>("all");
  const [sourceFilter, setSourceFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [newCourseId, setNewCourseId] = useState("");
  const [newCourseRelationship, setNewCourseRelationship] =
    useState<CourseRelationship>("interes");
  const [dateFrom, setDateFrom] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 29);
    return inputDate(date);
  });
  const [dateTo, setDateTo] = useState(() => inputDate(new Date()));

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      const [leadResponse, courseResponse] = await Promise.all([
        fetch("/api/contact-leads"),
        fetch("/api/courses"),
      ]);
      if (!leadResponse.ok || !courseResponse.ok) throw new Error();
      const [leadData, courseData] = await Promise.all([
        leadResponse.json() as Promise<Lead[]>,
        courseResponse.json() as Promise<{ items: CourseOption[] }>,
      ]);
      setLeads(leadData);
      setCourses(courseData.items ?? []);
      setSelectedLead((current) =>
        current ? leadData.find((lead) => lead.id === current.id) ?? null : null,
      );
    } catch {
      setError("No se pudo cargar la información del CRM.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchData(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const stats = useMemo(() => {
    const bySource: Record<string, number> = {};
    let nuevos = 0;
    let propuestas = 0;
    let inscritos = 0;
    let followups = 0;
    const now = new Date();

    for (const lead of leads) {
      const simplified = operationalStatus(lead.lead_status);
      if (simplified === "nuevo") nuevos += 1;
      if (simplified === "propuesta_enviada") propuestas += 1;
      if (simplified === "inscrito") inscritos += 1;
      if (lead.next_followup_at && new Date(lead.next_followup_at) <= now) {
        followups += 1;
      }
      bySource[lead.source] = (bySource[lead.source] || 0) + 1;
    }

    return { total: leads.length, nuevos, propuestas, inscritos, followups, bySource };
  }, [leads]);

  const interestOptions = useMemo(() => {
    const options = new Map<string, string>();
    const courseTitles = new Set<string>();
    for (const course of courses) {
      options.set(`course:${course.id}`, course.title);
      courseTitles.add(course.title.trim().toLocaleLowerCase("es"));
    }
    for (const lead of leads) {
      if (
        lead.service_interest &&
        !courseTitles.has(lead.service_interest.trim().toLocaleLowerCase("es"))
      ) {
        options.set(`text:${lead.service_interest}`, lead.service_interest);
      }
    }
    return [...options.entries()].sort((a, b) => a[1].localeCompare(b[1], "es"));
  }, [courses, leads]);

  const filteredLeads = useMemo(
    () =>
      leads.filter((lead) => {
        if (
          statusFilter !== "all" &&
          operationalStatus(lead.lead_status) !== statusFilter
        ) {
          return false;
        }
        if (sourceFilter && lead.source !== sourceFilter) return false;
        if (courseFilter.startsWith("course:")) {
          const id = courseFilter.slice(7);
          if (!lead.courses.some((course) => course.id === id)) return false;
        }
        if (
          courseFilter.startsWith("text:") &&
          lead.service_interest !== courseFilter.slice(5)
        ) {
          return false;
        }
        if (!search.trim()) return true;
        const query = search.trim().toLowerCase();
        return [
          lead.full_name,
          lead.email,
          lead.phone,
          lead.identity_document,
          lead.country,
          lead.profession,
          lead.workplace,
          lead.service_interest,
          ...lead.courses.map((course) => course.title),
        ].some((value) => value?.toLowerCase().includes(query));
      }),
    [courseFilter, leads, search, sourceFilter, statusFilter],
  );

  const campaignLeads = useMemo(() => {
    const start = new Date(`${dateFrom}T00:00:00`);
    const end = new Date(`${dateTo}T23:59:59.999`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
      return [];
    }
    return leads.filter((lead) => {
      const created = new Date(lead.created_at);
      return created >= start && created <= end;
    });
  }, [dateFrom, dateTo, leads]);

  const periodEnrolledLeads = useMemo(() => {
    const start = new Date(`${dateFrom}T00:00:00`);
    const end = new Date(`${dateTo}T23:59:59.999`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
      return [];
    }
    return leads.filter(
      (lead) =>
        operationalStatus(lead.lead_status) === "inscrito" &&
        new Date(lead.status_updated_at || lead.created_at) >= start &&
        new Date(lead.status_updated_at || lead.created_at) <= end,
    );
  }, [dateFrom, dateTo, leads]);

  const campaignAnalysis = useMemo(() => {
    const bySource = new Map<string, { contacts: number; enrolled: number }>();
    const byCampaign = new Map<
      string,
      { source: string; contacts: number; enrolled: number }
    >();
    const byCourse = new Map<string, { contacts: number; enrolled: number }>();
    const byDay = new Map<string, { contacts: number; enrolled: number }>();
    let proposals = 0;
    const enrolled = periodEnrolledLeads.length;

    for (const lead of campaignLeads) {
      const isEnrolled = operationalStatus(lead.lead_status) === "inscrito";
      if (operationalStatus(lead.lead_status) === "propuesta_enviada") proposals += 1;

      const source = sourceLabel(lead.source);
      const sourceRow = bySource.get(source) ?? { contacts: 0, enrolled: 0 };
      sourceRow.contacts += 1;
      if (isEnrolled) sourceRow.enrolled += 1;
      bySource.set(source, sourceRow);

      const campaign = lead.utm_campaign || "Sin campaña UTM";
      const campaignRow = byCampaign.get(campaign) ?? {
        source: lead.utm_source || source,
        contacts: 0,
        enrolled: 0,
      };
      campaignRow.contacts += 1;
      if (isEnrolled) campaignRow.enrolled += 1;
      byCampaign.set(campaign, campaignRow);

      const names = leadCourseNames(lead);
      for (const name of new Set(names.length ? names : ["Sin curso indicado"])) {
        const courseRow = byCourse.get(name) ?? { contacts: 0, enrolled: 0 };
        courseRow.contacts += 1;
        if (isEnrolled) courseRow.enrolled += 1;
        byCourse.set(name, courseRow);
      }

      const day = lead.created_at.slice(0, 10);
      const dayRow = byDay.get(day) ?? { contacts: 0, enrolled: 0 };
      dayRow.contacts += 1;
      byDay.set(day, dayRow);
    }

    for (const lead of periodEnrolledLeads) {
      const day = (lead.status_updated_at || lead.created_at).slice(0, 10);
      const dayRow = byDay.get(day) ?? { contacts: 0, enrolled: 0 };
      dayRow.enrolled += 1;
      byDay.set(day, dayRow);
    }

    const conversion = campaignLeads.length
      ? (enrolled / campaignLeads.length) * 100
      : 0;
    return {
      proposals,
      enrolled,
      conversion,
      bySource: [...bySource.entries()].sort((a, b) => b[1].contacts - a[1].contacts),
      byCampaign: [...byCampaign.entries()].sort(
        (a, b) => b[1].contacts - a[1].contacts,
      ),
      byCourse: [...byCourse.entries()].sort((a, b) => b[1].contacts - a[1].contacts),
      byDay: [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0])),
    };
  }, [campaignLeads, periodEnrolledLeads]);

  function selectStatus(status: OperationalStatus) {
    setStatusFilter(status);
    setSourceFilter("");
    setCourseFilter("");
  }

  function selectSource(source: string) {
    setSourceFilter(source);
    setStatusFilter("all");
    setCourseFilter("");
  }

  function clearFilters() {
    setStatusFilter("all");
    setSourceFilter("");
    setCourseFilter("");
    setSearch("");
  }

  async function selectLead(lead: Lead | null) {
    setSelectedLead(lead);
    setNewCourseId("");
    if (!lead) {
      setNotes([]);
      return;
    }
    try {
      const response = await fetch(`/api/lead-notes?leadId=${lead.id}`);
      if (response.ok) setNotes(await response.json());
    } catch {
      setNotes([]);
    }
  }

  async function updateLead(id: string, payload: Record<string, unknown>) {
    setSaving(true);
    try {
      const response = await fetch(`/api/contact-leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error();
      const updated = (await response.json()) as Lead;
      setLeads((current) =>
        current.map((lead) =>
          lead.id === id ? { ...updated, courses: lead.courses } : lead,
        ),
      );
      setSelectedLead((current) =>
        current?.id === id ? { ...updated, courses: current.courses } : current,
      );
    } catch {
      setError("No se pudo actualizar el contacto.");
    } finally {
      setSaving(false);
    }
  }

  async function addNote() {
    if (!selectedLead || !newNote.trim()) return;
    setSaving(true);
    try {
      const response = await fetch("/api/lead-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: selectedLead.id, body: newNote.trim() }),
      });
      if (!response.ok) throw new Error();
      const savedNote = (await response.json()) as LeadNote;
      setNotes((current) => [savedNote, ...current]);
      setNewNote("");
    } catch {
      setError("No se pudo guardar la nota.");
    } finally {
      setSaving(false);
    }
  }

  async function saveCourseInterest(
    courseId: string,
    relationship: CourseRelationship,
  ) {
    if (!selectedLead || !courseId) return;
    setCourseSaving(true);
    try {
      const response = await fetch(`/api/contact-leads/${selectedLead.id}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, relationship }),
      });
      if (!response.ok) throw new Error();
      setNewCourseId("");
      await fetchData();
    } catch {
      setError(
        "No se pudo guardar el curso. Verifica que la migración del CRM esté aplicada.",
      );
    } finally {
      setCourseSaving(false);
    }
  }

  async function removeCourseInterest(courseId: string) {
    if (!selectedLead) return;
    setCourseSaving(true);
    try {
      const response = await fetch(
        `/api/contact-leads/${selectedLead.id}/courses?courseId=${courseId}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error();
      await fetchData();
    } catch {
      setError("No se pudo retirar el curso del contacto.");
    } finally {
      setCourseSaving(false);
    }
  }

  function setQuickRange(days: number) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));
    setDateFrom(inputDate(start));
    setDateTo(inputDate(end));
  }

  const activeFilters = Boolean(
    search || sourceFilter || courseFilter || statusFilter !== "all",
  );
  const maxDaily = Math.max(
    1,
    ...campaignAnalysis.byDay.map(([, value]) => value.contacts),
  );

  return (
    <main className="min-h-screen bg-[#fbf7f4] px-4 py-6 text-[#17345f] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-6 flex flex-col gap-5 border-b border-[#17345f]/10 pb-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              CRM NeoSer
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Contactos, cursos y resultados comerciales en un solo lugar.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void fetchData()}
              className="inline-flex items-center gap-2 rounded-full border border-[#17345f]/20 bg-white px-4 py-2 text-sm font-semibold hover:border-[#17345f]/50"
            >
              <RefreshCw size={16} aria-hidden="true" />
              Actualizar
            </button>
            <button
              type="button"
              onClick={() => exportCSV(filteredLeads)}
              disabled={!filteredLeads.length}
              className="inline-flex items-center gap-2 rounded-full bg-[#17345f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#102949] disabled:opacity-40"
            >
              <Download size={16} aria-hidden="true" />
              Exportar contactos
            </button>
          </div>
        </header>

        <nav
          aria-label="Secciones del CRM"
          className="mb-7 inline-flex rounded-full border border-[#17345f]/15 bg-white p-1"
        >
          <button
            type="button"
            onClick={() => setView("contactos")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              view === "contactos"
                ? "bg-[#17345f] text-white"
                : "text-slate-600 hover:text-[#17345f]"
            }`}
          >
            <ContactRound size={17} aria-hidden="true" />
            Contactos
          </button>
          <button
            type="button"
            onClick={() => setView("campanas")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              view === "campanas"
                ? "bg-[#17345f] text-white"
                : "text-slate-600 hover:text-[#17345f]"
            }`}
          >
            <BarChart3 size={17} aria-hidden="true" />
            Campañas
          </button>
        </nav>

        {error ? (
          <div className="mb-5 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} aria-label="Cerrar alerta">
              <X size={18} />
            </button>
          </div>
        ) : null}

        {view === "contactos" ? (
          <>
            <section
              aria-label="Resumen de contactos"
              className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5"
            >
              <button
                type="button"
                onClick={() => selectStatus("all")}
                className={`rounded-[1.35rem] bg-[#17345f] p-5 text-left text-white ${
                  statusFilter === "all" ? "ring-4 ring-[#e8879b]/35" : ""
                }`}
              >
                <UsersRound size={22} className="mb-5 text-[#f3b0bd]" aria-hidden="true" />
                <span className="block text-4xl font-bold">{stats.total}</span>
                <span className="mt-1 block text-sm text-white/75">Todos los contactos</span>
              </button>
              <StatusCard
                label="Nuevos"
                value={stats.nuevos}
                icon={<UserPlus size={21} />}
                active={statusFilter === "nuevo"}
                onClick={() => selectStatus("nuevo")}
              />
              <StatusCard
                label="Propuesta enviada"
                value={stats.propuestas}
                icon={<FileText size={21} />}
                active={statusFilter === "propuesta_enviada"}
                onClick={() => selectStatus("propuesta_enviada")}
              />
              <StatusCard
                label="Inscritos"
                value={stats.inscritos}
                icon={<BadgeCheck size={21} />}
                active={statusFilter === "inscrito"}
                onClick={() => selectStatus("inscrito")}
              />
              <div className="rounded-[1.35rem] border border-amber-200 bg-amber-50 p-5">
                <CalendarClock size={21} className="mb-5 text-amber-700" aria-hidden="true" />
                <span className="block text-3xl font-bold text-amber-800">
                  {stats.followups}
                </span>
                <span className="mt-1 block text-sm text-amber-800/75">
                  Seguimientos pendientes
                </span>
              </div>
            </section>

            <section className="mb-6 rounded-[1.35rem] border border-[#17345f]/10 bg-white p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">Encuentra el contacto correcto</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Elegir una etapa o fuente reinicia los otros filtros para evitar resultados vacíos.
                  </p>
                </div>
                {activeFilters ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#b94d67] hover:underline"
                  >
                    <FilterX size={16} aria-hidden="true" />
                    Limpiar filtros
                  </button>
                ) : null}
              </div>

              <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_minmax(230px,0.65fr)]">
                <label className="relative block">
                  <span className="sr-only">Buscar contactos</span>
                  <Search
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar por nombre, DNI, teléfono, país o curso"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#e8879b] focus:ring-2 focus:ring-[#e8879b]/20"
                  />
                </label>
                <label>
                  <span className="sr-only">Filtrar por curso o interés</span>
                  <select
                    value={courseFilter}
                    onChange={(event) => {
                      setCourseFilter(event.target.value);
                      setStatusFilter("all");
                      setSourceFilter("");
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#e8879b]"
                  >
                    <option value="">Todos los cursos e intereses</option>
                    {interestOptions.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 flex flex-wrap gap-2" aria-label="Filtrar por fuente">
                <button
                  type="button"
                  onClick={() => selectSource("")}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    !sourceFilter
                      ? "border-[#17345f] bg-[#17345f] text-white"
                      : "border-slate-200 text-slate-600 hover:border-slate-400"
                  }`}
                >
                  Todas las fuentes ({stats.total})
                </button>
                {Object.entries(stats.bySource)
                  .sort((a, b) => b[1] - a[1])
                  .map(([source, count]) => (
                    <button
                      type="button"
                      key={source}
                      onClick={() => selectSource(source)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                        sourceFilter === source
                          ? "border-[#17345f] bg-[#17345f] text-white"
                          : "border-slate-200 text-slate-600 hover:border-slate-400"
                      }`}
                    >
                      {sourceLabel(source)} ({count})
                    </button>
                  ))}
              </div>
            </section>

            <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
              <section className="overflow-hidden rounded-[1.35rem] border border-[#17345f]/10 bg-white">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div>
                    <h2 className="font-semibold">Todos los contactos</h2>
                    <p className="mt-1 text-xs text-slate-500">
                      {filteredLeads.length === leads.length
                        ? `${leads.length} registros en total`
                        : `${filteredLeads.length} de ${leads.length} registros`}
                    </p>
                  </div>
                </div>

                {loading ? (
                  <p className="py-16 text-center text-sm text-slate-500">Cargando contactos…</p>
                ) : filteredLeads.length === 0 ? (
                  <div className="px-5 py-16 text-center">
                    <p className="font-semibold">No hay contactos con estos filtros.</p>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-3 text-sm font-semibold text-[#b94d67] hover:underline"
                    >
                      Mostrar todos
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[880px] text-left text-sm">
                      <thead className="bg-[#f3f6fa] text-xs text-slate-500">
                        <tr>
                          <th className="px-5 py-3 font-semibold">Contacto</th>
                          <th className="px-4 py-3 font-semibold">WhatsApp</th>
                          <th className="px-4 py-3 font-semibold">Cursos / intereses</th>
                          <th className="px-4 py-3 font-semibold">Fuente</th>
                          <th className="px-4 py-3 font-semibold">Etapa</th>
                          <th className="px-4 py-3 font-semibold">Registro</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredLeads.map((lead) => (
                          <tr
                            key={lead.id}
                            onClick={() => void selectLead(lead)}
                            className={`cursor-pointer align-top transition-colors hover:bg-[#fff8f8] ${
                              selectedLead?.id === lead.id ? "bg-[#fff1f4]" : ""
                            }`}
                          >
                            <td className="px-5 py-4">
                              <span className="block font-semibold text-[#17345f]">
                                {lead.full_name}
                              </span>
                              <span className="mt-1 block text-xs text-slate-500">
                                {lead.email || "Sin correo"}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-slate-600">{lead.phone}</td>
                            <td className="max-w-[280px] px-4 py-4">
                              <div className="flex flex-wrap gap-1.5">
                                {leadCourseNames(lead).length ? (
                                  leadCourseNames(lead).map((name) => (
                                    <span
                                      key={name}
                                      className="rounded-full bg-[#eef4fb] px-2.5 py-1 text-xs text-[#295a8d]"
                                    >
                                      {name}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-slate-400">Sin curso</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-xs text-slate-600">
                              {sourceLabel(lead.source)}
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(
                                  lead.lead_status,
                                )}`}
                              >
                                {statusLabel(lead.lead_status)}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-xs text-slate-500">
                              {fmtDate(lead.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {selectedLead ? (
                <aside className="sticky top-5 rounded-[1.35rem] border border-[#17345f]/10 bg-white p-5 shadow-[0_18px_45px_rgba(23,52,95,0.08)]">
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">{selectedLead.full_name}</h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Registrado {fmtDateTime(selectedLead.created_at)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void selectLead(null)}
                      aria-label="Cerrar detalle"
                      className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
                    >
                      <X size={19} />
                    </button>
                  </div>

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    <ContactDetail label="WhatsApp" value={selectedLead.phone} />
                    <ContactDetail label="Correo" value={selectedLead.email || "—"} />
                    <ContactDetail
                      label="DNI / documento"
                      value={selectedLead.identity_document || "—"}
                    />
                    <ContactDetail label="País" value={selectedLead.country || "—"} />
                    <ContactDetail
                      label="Profesión"
                      value={selectedLead.profession || "—"}
                    />
                    <ContactDetail
                      label="Centro laboral"
                      value={selectedLead.workplace || "—"}
                    />
                    <ContactDetail
                      label="Consentimiento WhatsApp"
                      value={selectedLead.wa_consent ? "Sí" : "No"}
                    />
                    <ContactDetail label="Fuente" value={sourceLabel(selectedLead.source)} />
                  </dl>

                  <div className="mt-5 rounded-xl bg-[#fbf7f4] p-3 text-sm text-slate-600">
                    <span className="mb-1 block text-xs font-semibold text-slate-500">
                      Mensaje
                    </span>
                    {selectedLead.message}
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                    <label className="text-xs font-semibold text-slate-600">
                      Etapa
                      <select
                        value={
                          operationalStatus(selectedLead.lead_status) === "archivado"
                            ? "nuevo"
                            : operationalStatus(selectedLead.lead_status)
                        }
                        onChange={(event) =>
                          void updateLead(selectedLead.id, {
                            leadStatus: event.target.value,
                          })
                        }
                        disabled={saving}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                      >
                        {EDITABLE_STATUSES.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs font-semibold text-slate-600">
                      Próximo seguimiento
                      <input
                        type="datetime-local"
                        value={selectedLead.next_followup_at?.slice(0, 16) || ""}
                        onChange={(event) =>
                          void updateLead(selectedLead.id, {
                            nextFollowupAt: event.target.value
                              ? new Date(event.target.value).toISOString()
                              : null,
                          })
                        }
                        disabled={saving}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                      />
                    </label>
                  </div>

                  <section className="mt-6 border-t border-slate-100 pt-5">
                    <h3 className="font-semibold">Cursos e intereses</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Un contacto puede estar asociado a varios cursos.
                    </p>

                    <div className="mt-3 space-y-2">
                      {selectedLead.courses.map((course) => (
                        <div
                          key={course.id}
                          className="flex items-center gap-2 rounded-xl border border-slate-200 p-2.5"
                        >
                          <span className="min-w-0 flex-1 truncate text-sm font-medium">
                            {course.title}
                          </span>
                          <select
                            value={course.relationship}
                            disabled={courseSaving}
                            onChange={(event) =>
                              void saveCourseInterest(
                                course.id,
                                event.target.value as CourseRelationship,
                              )
                            }
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs"
                          >
                            <option value="interes">Interés</option>
                            <option value="inscrito">Inscrito</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => void removeCourseInterest(course.id)}
                            disabled={courseSaving}
                            aria-label={`Retirar ${course.title}`}
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                      {!selectedLead.courses.length ? (
                        <p className="rounded-xl border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-500">
                          Todavía no tiene cursos asociados.
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                      <select
                        value={newCourseId}
                        onChange={(event) => setNewCourseId(event.target.value)}
                        className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                      >
                        <option value="">Selecciona un curso</option>
                        {courses
                          .filter(
                            (course) =>
                              !selectedLead.courses.some((item) => item.id === course.id),
                          )
                          .map((course) => (
                            <option key={course.id} value={course.id}>
                              {course.title}
                            </option>
                          ))}
                      </select>
                      <button
                        type="button"
                        onClick={() =>
                          void saveCourseInterest(newCourseId, newCourseRelationship)
                        }
                        disabled={!newCourseId || courseSaving}
                        className="rounded-xl bg-[#e8879b] px-3 text-white hover:bg-[#d66f87] disabled:opacity-40"
                        aria-label="Añadir curso"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <select
                      value={newCourseRelationship}
                      onChange={(event) =>
                        setNewCourseRelationship(event.target.value as CourseRelationship)
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                    >
                      <option value="interes">Lo tiene como interés</option>
                      <option value="inscrito">Ya está inscrito</option>
                    </select>
                  </section>

                  <section className="mt-6 border-t border-slate-100 pt-5">
                    <h3 className="font-semibold">Notas internas ({notes.length})</h3>
                    <div className="mt-3 flex gap-2">
                      <input
                        value={newNote}
                        onChange={(event) => setNewNote(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") void addNote();
                        }}
                        placeholder="Escribe una nota"
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => void addNote()}
                        disabled={!newNote.trim() || saving}
                        className="rounded-xl bg-[#17345f] px-3 text-white disabled:opacity-40"
                        aria-label="Guardar nota"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <div className="mt-3 max-h-52 space-y-2 overflow-y-auto">
                      {notes.map((note) => (
                        <article key={note.id} className="rounded-xl bg-slate-50 p-3 text-sm">
                          <p className="text-slate-700">{note.body}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {note.profiles?.full_name || "Admin"} · {fmtDateTime(note.created_at)}
                          </p>
                        </article>
                      ))}
                    </div>
                  </section>
                </aside>
              ) : (
                <aside className="rounded-[1.35rem] border border-dashed border-[#17345f]/20 bg-white/60 px-6 py-12 text-center">
                  <ContactRound size={30} className="mx-auto text-[#e8879b]" />
                  <p className="mt-4 font-semibold">Selecciona un contacto</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Aquí verás sus datos, cursos, seguimiento y notas.
                  </p>
                </aside>
              )}
            </div>
          </>
        ) : (
          <section>
            <div className="mb-6 rounded-[1.35rem] border border-[#17345f]/10 bg-white p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold">Actividad de campañas</h2>
                  <p className="mt-1 max-w-2xl text-sm text-slate-500">
                    Analiza los contactos y las inscripciones registradas en el CRM durante el periodo elegido.
                  </p>
                </div>
                <div className="flex flex-wrap items-end gap-2">
                  <label className="text-xs font-semibold text-slate-600">
                    Desde
                    <input
                      type="date"
                      value={dateFrom}
                      max={dateTo}
                      onChange={(event) => setDateFrom(event.target.value)}
                      className="mt-1 block rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                    />
                  </label>
                  <label className="text-xs font-semibold text-slate-600">
                    Hasta
                    <input
                      type="date"
                      value={dateTo}
                      min={dateFrom}
                      onChange={(event) => setDateTo(event.target.value)}
                      className="mt-1 block rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setQuickRange(7)}
                    className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold"
                  >
                    7 días
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickRange(30)}
                    className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold"
                  >
                    30 días
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <CampaignMetric
                label="Contactos nuevos"
                value={campaignLeads.length.toString()}
                note="Registros creados en el periodo"
              />
              <CampaignMetric
                label="Propuestas enviadas"
                value={campaignAnalysis.proposals.toString()}
                note="Contactos con enlace o propuesta"
              />
              <CampaignMetric
                label="Nuevos inscritos"
                value={campaignAnalysis.enrolled.toString()}
                note="Inscripciones registradas en CRM"
              />
              <CampaignMetric
                label="Conversión"
                value={`${campaignAnalysis.conversion.toFixed(1)}%`}
                note="Inscritos sobre contactos"
                accent
              />
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <AnalyticsTable
                title="Resultados por fuente"
                firstColumn="Fuente"
                rows={campaignAnalysis.bySource.map(([label, values]) => ({
                  label,
                  contacts: values.contacts,
                  enrolled: values.enrolled,
                }))}
              />
              <AnalyticsTable
                title="Resultados por campaña UTM"
                firstColumn="Campaña"
                rows={campaignAnalysis.byCampaign.map(([label, values]) => ({
                  label,
                  detail: values.source,
                  contacts: values.contacts,
                  enrolled: values.enrolled,
                }))}
              />
              <AnalyticsTable
                title="Participación por curso o interés"
                firstColumn="Curso / interés"
                rows={campaignAnalysis.byCourse.map(([label, values]) => ({
                  label,
                  contacts: values.contacts,
                  enrolled: values.enrolled,
                }))}
              />
              <section className="rounded-[1.35rem] border border-[#17345f]/10 bg-white p-5">
                <div className="mb-5">
                  <h3 className="font-semibold">Actividad por día</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    El número de la derecha muestra contactos e inscritos.
                  </p>
                </div>
                {campaignAnalysis.byDay.length ? (
                  <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                    {campaignAnalysis.byDay.map(([day, values]) => (
                      <div key={day} className="grid grid-cols-[82px_1fr_auto] items-center gap-3">
                        <span className="text-xs text-slate-500">
                          {new Date(`${day}T12:00:00`).toLocaleDateString("es-PE", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-[#e8879b]"
                            style={{
                              width: `${Math.max(6, (values.contacts / maxDaily) * 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-semibold">
                          {values.contacts} / {values.enrolled}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-12 text-center text-sm text-slate-500">
                    No hay actividad en este rango.
                  </p>
                )}
              </section>
            </div>

            <div className="mt-5 rounded-[1.35rem] border border-[#17345f]/10 bg-[#eef4fb] p-5 text-sm text-slate-600">
              <strong className="text-[#17345f]">Qué se analiza aquí:</strong> actividad del CRM,
              fuentes, campañas UTM y cursos. El reporte de ingresos en PEN/USD, tráfico GA4 y
              métricas manuales de ManyChat continúa en Google Sheets para mantener separados los
              datos personales y los indicadores financieros.
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function StatusCard({
  label,
  value,
  icon,
  active,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[1.35rem] border bg-white p-5 text-left transition-colors ${
        active
          ? "border-[#e8879b] ring-4 ring-[#e8879b]/15"
          : "border-[#17345f]/10 hover:border-[#17345f]/30"
      }`}
    >
      <span className="mb-5 block text-[#e8879b]">{icon}</span>
      <span className="block text-3xl font-bold">{value}</span>
      <span className="mt-1 block text-sm text-slate-500">{label}</span>
    </button>
  );
}

function ContactDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold text-slate-400">{label}</dt>
      <dd className="mt-1 break-words text-slate-700">{value}</dd>
    </div>
  );
}

function CampaignMetric({
  label,
  value,
  note,
  accent = false,
}: {
  label: string;
  value: string;
  note: string;
  accent?: boolean;
}) {
  return (
    <article
      className={`rounded-[1.35rem] border p-5 ${
        accent
          ? "border-[#17345f] bg-[#17345f] text-white"
          : "border-[#17345f]/10 bg-white"
      }`}
    >
      <p className={`text-sm font-semibold ${accent ? "text-white/75" : "text-slate-500"}`}>
        {label}
      </p>
      <p className="mt-4 text-4xl font-bold">{value}</p>
      <p className={`mt-2 text-xs ${accent ? "text-white/65" : "text-slate-400"}`}>
        {note}
      </p>
    </article>
  );
}

function AnalyticsTable({
  title,
  firstColumn,
  rows,
}: {
  title: string;
  firstColumn: string;
  rows: Array<{
    label: string;
    detail?: string;
    contacts: number;
    enrolled: number;
  }>;
}) {
  return (
    <section className="overflow-hidden rounded-[1.35rem] border border-[#17345f]/10 bg-white">
      <div className="border-b border-slate-100 px-5 py-4">
        <h3 className="font-semibold">{title}</h3>
      </div>
      {rows.length ? (
        <div className="max-h-80 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-[#f3f6fa] text-xs text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">{firstColumn}</th>
                <th className="px-3 py-3 text-right font-semibold">Contactos</th>
                <th className="px-3 py-3 text-right font-semibold">Inscritos</th>
                <th className="px-5 py-3 text-right font-semibold">Conversión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={`${row.label}:${row.detail || ""}`}>
                  <td className="px-5 py-3">
                    <span className="block font-medium">{row.label}</span>
                    {row.detail ? (
                      <span className="mt-0.5 block text-xs text-slate-400">{row.detail}</span>
                    ) : null}
                  </td>
                  <td className="px-3 py-3 text-right">{row.contacts}</td>
                  <td className="px-3 py-3 text-right">{row.enrolled}</td>
                  <td className="px-5 py-3 text-right font-semibold">
                    {row.contacts ? ((row.enrolled / row.contacts) * 100).toFixed(1) : "0.0"}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-slate-500">Sin datos en este periodo.</p>
      )}
    </section>
  );
}
