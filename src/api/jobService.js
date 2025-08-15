// ===============================================
// SERVIÇO DE API PARA VAGAS DE EMPREGO
// ===============================================

const API_CONFIG = {
  jooble: {
    baseUrl: '/api/jooble',
    enabled: false, // Ativar quando houver proxy configurado
  },
  adzuna: {
    baseUrl: '/api/adzuna',
    enabled: false, // Ativar quando houver proxy configurado
  }
};

// ===============================================
// DADOS SIMULADOS APRIMORADOS
// ===============================================
const DEMO_COMPANIES = [
  { name: "Nubank", sector: "Fintech", size: "Grande" },
  { name: "iFood", sector: "Delivery", size: "Grande" },
  { name: "Magazine Luiza", sector: "E-commerce", size: "Grande" },
  { name: "Mercado Livre", sector: "E-commerce", size: "Grande" },
  { name: "Stone", sector: "Fintech", size: "Média" },
  { name: "PicPay", sector: "Fintech", size: "Média" },
  { name: "Gympass", sector: "Saúde", size: "Média" },
  { name: "Loggi", sector: "Logística", size: "Média" },
  { name: "QuintoAndar", sector: "PropTech", size: "Média" },
  { name: "Creditas", sector: "Fintech", size: "Média" },
  { name: "Conta Azul", sector: "SaaS", size: "Pequena" },
  { name: "Resultados Digitais", sector: "Marketing", size: "Pequena" },
  { name: "Rock Content", sector: "Marketing", size: "Pequena" },
  { name: "Hotmart", sector: "EdTech", size: "Média" },
  { name: "Movile", sector: "Mobile", size: "Média" },
  { name: "VTEX", sector: "E-commerce", size: "Média" },
  { name: "Locaweb", sector: "Hosting", size: "Média" },
  { name: "UOL", sector: "Mídia", size: "Grande" },
  { name: "Globo.com", sector: "Mídia", size: "Grande" },
  { name: "B2W Digital", sector: "E-commerce", size: "Grande" }
];

const DEMO_CITIES = [
  { name: "São Paulo", state: "SP", region: "Sudeste" },
  { name: "Rio de Janeiro", state: "RJ", region: "Sudeste" },
  { name: "Belo Horizonte", state: "MG", region: "Sudeste" },
  { name: "Porto Alegre", state: "RS", region: "Sul" },
  { name: "Curitiba", state: "PR", region: "Sul" },
  { name: "Recife", state: "PE", region: "Nordeste" },
  { name: "Salvador", state: "BA", region: "Nordeste" },
  { name: "Brasília", state: "DF", region: "Centro-Oeste" },
  { name: "Fortaleza", state: "CE", region: "Nordeste" },
  { name: "Florianópolis", state: "SC", region: "Sul" }
];

const JOB_TYPES = ["Remoto", "Presencial", "Híbrido"];
const SENIORITY_LEVELS = ["Júnior", "Pleno", "Sênior", "Especialista"];

// ===============================================
// GERADOR DE DADOS SIMULADOS
// ===============================================
function generateDemoJob(index, keywords, location) {
  const company = DEMO_COMPANIES[index % DEMO_COMPANIES.length];
  const city = DEMO_CITIES[index % DEMO_CITIES.length];
  const jobType = JOB_TYPES[index % JOB_TYPES.length];
  const seniority = SENIORITY_LEVELS[index % SENIORITY_LEVELS.length];
  
  // Varia as datas para simular vagas recentes e antigas
  const daysAgo = Math.floor(Math.random() * 30);
  const publishedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
  
  // Gera salário baseado na senioridade
  const baseSalary = {
    "Júnior": 3000,
    "Pleno": 6000,
    "Sênior": 10000,
    "Especialista": 15000
  };
  
  const salary = Math.random() > 0.3 ? 
    `R$ ${(baseSalary[seniority] + Math.random() * baseSalary[seniority] * 0.5).toFixed(0)}` : 
    null;

  // Gera descrições mais realistas
  const descriptions = [
    `Oportunidade para ${keywords.toLowerCase()} em ${company.name}. Trabalhe com tecnologias modernas e uma equipe incrível.`,
    `${company.name} busca ${keywords.toLowerCase()} ${seniority.toLowerCase()} para integrar nosso time de produto.`,
    `Vaga de ${keywords.toLowerCase()} na ${company.name}. Ambiente colaborativo e oportunidades de crescimento.`,
    `${company.name} está contratando ${keywords.toLowerCase()} para projetos inovadores no setor ${company.sector.toLowerCase()}.`
  ];

  return {
    title: `${keywords} - ${seniority}`,
    company: company.name,
    location: location === "Brasil" ? `${city.name}, ${city.state}` : location,
    publishedAt: publishedAt,
    url: `https://exemplo.com/vaga/${company.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
    type: jobType,
    salary: salary,
    snippet: descriptions[index % descriptions.length] + ` ${jobType} disponível.`,
    sector: company.sector,
    companySize: company.size,
    seniority: seniority
  };
}

// ===============================================
// FUNÇÕES DE API
// ===============================================

/**
 * Busca vagas usando APIs reais ou dados simulados
 */
export async function fetchJobs({ keywords, location = "Brasil", page = 1, pageSize = 20 }) {
  // Simula delay da API
  await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
  
  // Por enquanto, sempre usa dados simulados
  // TODO: Implementar integração com APIs reais quando proxy estiver configurado
  if (true || !API_CONFIG.jooble.enabled) {
    return fetchDemoJobs({ keywords, location, page, pageSize });
  }
  
  // Código para APIs reais (implementar quando necessário)
  try {
    const response = await fetch(API_CONFIG.jooble.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keywords,
        location: location === "Brasil" ? "" : location,
        page,
        ResultOnPage: pageSize
      })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return normalizeApiResponse(data);
  } catch (error) {
    console.error('API Error:', error);
    // Fallback para dados simulados em caso de erro
    return fetchDemoJobs({ keywords, location, page, pageSize });
  }
}

/**
 * Gera dados simulados para demonstração
 */
async function fetchDemoJobs({ keywords, location, page, pageSize }) {
  const startIndex = (page - 1) * pageSize;
  const jobs = [];
  
  for (let i = 0; i < pageSize; i++) {
    const index = startIndex + i;
    jobs.push(generateDemoJob(index, keywords, location));
  }

  return {
    totalCount: 500, // Simula um total grande para testar paginação
    jobs,
    page,
    pageSize,
    hasMore: page < 25 // Simula 25 páginas de resultados
  };
}

/**
 * Normaliza resposta da API para formato padrão
 */
function normalizeApiResponse(data) {
  const jobs = (data?.jobs || data?.results || []).map(job => ({
    title: job.title || job.name || "Sem título",
    company: job.company || job.companyName || job.employer || "Empresa não informada",
    location: job.location || job.city || "Brasil",
    publishedAt: job.updated || job.published || job.date || null,
    url: job.link || job.url || "#",
    type: job.type || job.jobType || "",
    salary: job.salary || null,
    snippet: job.snippet || job.description || ""
  }));

  return {
    totalCount: data?.totalCount || data?.count || jobs.length,
    jobs,
    hasMore: jobs.length === 20 // Assume que há mais se retornou página completa
  };
}

/**
 * Busca sugestões de cidades
 */
export function getCitySuggestions(query) {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase();
  return DEMO_CITIES
    .filter(city => 
      city.name.toLowerCase().includes(normalizedQuery) ||
      city.state.toLowerCase().includes(normalizedQuery)
    )
    .map(city => `${city.name}, ${city.state}`)
    .slice(0, 5);
}

/**
 * Estatísticas de vagas por região (para futuras funcionalidades)
 */
export function getJobStatistics(jobs) {
  const stats = {
    byRegion: {},
    byCompanySize: {},
    bySeniority: {},
    byType: {},
    averageSalary: 0
  };
  
  jobs.forEach(job => {
    // Por região
    const city = DEMO_CITIES.find(c => job.location.includes(c.name));
    if (city) {
      stats.byRegion[city.region] = (stats.byRegion[city.region] || 0) + 1;
    }
    
    // Por tipo
    if (job.type) {
      stats.byType[job.type] = (stats.byType[job.type] || 0) + 1;
    }
    
    // Por senioridade
    if (job.seniority) {
      stats.bySeniority[job.seniority] = (stats.bySeniority[job.seniority] || 0) + 1;
    }
    
    // Por tamanho da empresa
    if (job.companySize) {
      stats.byCompanySize[job.companySize] = (stats.byCompanySize[job.companySize] || 0) + 1;
    }
  });
  
  return stats;
}

