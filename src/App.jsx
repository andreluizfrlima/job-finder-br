import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Star, 
  StarOff, 
  Loader2, 
  ExternalLink, 
  MapPin, 
  Briefcase, 
  CalendarClock, 
  Download, 
  Filter, 
  Trash2,
  Building2,
  Clock,
  FileText,
  BarChart3
} from "lucide-react";
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { useJobs, useFavorites, useInfiniteScroll } from './hooks/useJobs.js';
import { exportJobsAsCSV, exportJobsAsJSON, exportJobReport } from './utils/exportUtils.js';
import './App.css';

// ===============================================
// CONFIGURAÇÕES
// ===============================================
const ROLES = [
  "Content Designer",
  "Content Strategist", 
  "Digital Storyteller",
  "Documentation Manager",
  "Documentation Specialist",
  "Information Architect",
  "Technical Author",
  "Technical Communicator",
  "Technical Editor",
  "Technical Evangelist",
];

// ===============================================
// HELPERS
// ===============================================
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("pt-BR", { 
    year: "numeric", 
    month: "short", 
    day: "2-digit" 
  });
}

function isFresh(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return false;
  const diff = Date.now() - d.getTime();
  const ONE_DAY = 24 * 60 * 60 * 1000;
  return diff <= ONE_DAY;
}

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================
export default function JobFinderBR() {
  const [query, setQuery] = useState(ROLES[0]);
  const [rolePreset, setRolePreset] = useState(ROLES[0]);
  const [city, setCity] = useState("");
  const [mode, setMode] = useState(""); // Remoto | Presencial | Híbrido
  
  // Hooks customizados
  const { jobs, loading, error, hasMore, totalCount, searchJobs, loadMore, clearJobs } = useJobs();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  
  // Scroll infinito
  const sentinelRef = useInfiniteScroll(
    () => loadMore({ keywords: buildKeywords(), location: city, mode }),
    hasMore,
    loading
  );

  const appliedFilters = useMemo(() => {
    const parts = [query];
    if (city) parts.push(`cidade:${city}`);
    if (mode) parts.push(`modalidade:${mode}`);
    return parts.filter(Boolean).join(" | ");
  }, [query, city, mode]);

  function buildKeywords() {
    return rolePreset || query;
  }

  async function resetAndSearch() {
    const searchParams = {
      keywords: buildKeywords(),
      location: city,
      mode
    };
    await searchJobs(searchParams);
  }

  function clearFilters() {
    setQuery(ROLES[0]);
    setRolePreset(ROLES[0]);
    setCity("");
    setMode("");
    clearJobs();
    // Busca com filtros limpos
    setTimeout(() => {
      searchJobs({ keywords: ROLES[0], location: "", mode: "" });
    }, 100);
  }

  // Busca inicial
  React.useEffect(() => {
    resetAndSearch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/90 border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              initial={{ opacity: 0, y: -6 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center"
            >
              <Briefcase className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">JobFinderBR</h1>
              <p className="text-sm text-gray-600">Vagas de conteúdo e documentação no Brasil</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <Button 
                onClick={() => exportJobsAsCSV(jobs)} 
                variant="outline"
                size="sm"
                disabled={jobs.length === 0}
              >
                <Download className="w-4 h-4 mr-2"/>
                CSV
              </Button>
              <Button 
                onClick={() => exportJobsAsJSON(jobs)} 
                variant="outline"
                size="sm"
                disabled={jobs.length === 0}
              >
                <FileText className="w-4 h-4 mr-2"/>
                JSON
              </Button>
              <Button 
                onClick={() => exportJobReport(jobs)} 
                variant="outline"
                size="sm"
                disabled={jobs.length === 0}
              >
                <BarChart3 className="w-4 h-4 mr-2"/>
                Relatório
              </Button>
            </div>
            <Button onClick={clearFilters} variant="outline">
              <Trash2 className="w-4 h-4 mr-2"/>
              Limpar
            </Button>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Filtros de Busca</CardTitle>
            <div className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
              Modo Demonstração
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Cargo (preset)
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={rolePreset}
                  onChange={(e) => setRolePreset(e.target.value)}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Cidade (opcional)
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="São Paulo, Rio de Janeiro..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Modalidade
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                >
                  <option value="">Qualquer</option>
                  <option value="Remoto">Remoto</option>
                  <option value="Presencial">Presencial</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>
              
              <div className="md:col-span-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Busca personalizada
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={ROLES.join(" OR ")}
                    />
                  </div>
                  <Button onClick={resetAndSearch} className="shrink-0">
                    <Filter className="w-4 h-4 mr-2"/>
                    Aplicar
                  </Button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Filtros ativos: {appliedFilters}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Lista de vagas */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <p className="font-medium">Erro ao carregar vagas</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Estatísticas */}
        {jobs.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Mostrando {jobs.length} vagas • {favorites.length} favoritas
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              Atualizado agora
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job, idx) => (
            <motion.div 
              key={job.id || `${job.url}-${idx}`} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
            >
              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                          <Briefcase className="mr-1 w-3 h-3"/>
                          {job.role || "Vaga"}
                        </span>
                        {isFresh(job.publishedAt) && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                            Novo (24h)
                          </span>
                        )}
                        {job.type && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                            {job.type}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        <a href={job.url} target="_blank" rel="noreferrer">
                          {job.title}
                        </a>
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="w-4 h-4"/>
                          {job.company}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-4 h-4"/>
                          {job.location || "Brasil"}
                        </span>
                        {job.publishedAt && (
                          <span className="inline-flex items-center gap-1">
                            <CalendarClock className="w-4 h-4"/>
                            {formatDate(job.publishedAt)}
                          </span>
                        )}
                        {job.salary && (
                          <span className="inline-flex items-center gap-1 font-medium text-green-600">
                            💰 {job.salary}
                          </span>
                        )}
                      </div>
                      
                      {job.snippet && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {job.snippet}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 md:flex-col md:items-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(job)}
                        className={`transition-colors ${
                          isFavorite(job) 
                            ? "text-yellow-600 hover:text-yellow-700" 
                            : "text-gray-400 hover:text-yellow-600"
                        }`}
                      >
                        {isFavorite(job) ? (
                          <Star className="w-4 h-4 fill-current" />
                        ) : (
                          <StarOff className="w-4 h-4" />
                        )}
                      </Button>
                      
                      <Button asChild size="sm">
                        <a href={job.url} target="_blank" rel="noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2"/>
                          Ver vaga
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Loading e Scroll Infinito */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-gray-600">Carregando vagas...</span>
          </div>
        )}

        {/* Sentinel para scroll infinito */}
        {hasMore && !loading && (
          <div ref={sentinelRef} className="h-10" />
        )}

        {/* Fim dos resultados */}
        {!hasMore && jobs.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Todas as vagas foram carregadas ({jobs.length} total)
            </p>
          </div>
        )}

        {/* Estado vazio */}
        {!loading && jobs.length === 0 && !error && (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma vaga encontrada
            </h3>
            <p className="text-gray-500 mb-4">
              Tente ajustar os filtros ou termos de busca
            </p>
            <Button onClick={clearFilters} variant="outline">
              Limpar filtros
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

