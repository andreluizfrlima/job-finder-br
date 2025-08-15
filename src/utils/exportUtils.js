/**
 * Utilitários para exportação de dados
 */

/**
 * Converte array de vagas para formato CSV
 */
export function jobsToCSV(jobs) {
  if (!jobs || jobs.length === 0) {
    return 'cargo,titulo,empresa,local,publicadoEm,modalidade,salario,link\n';
  }

  const headers = [
    'cargo',
    'titulo', 
    'empresa',
    'local',
    'publicadoEm',
    'modalidade',
    'salario',
    'link'
  ];

  const csvRows = [headers.join(',')];

  jobs.forEach(job => {
    const row = [
      job.role || '',
      job.title || '',
      job.company || '',
      job.location || '',
      job.publishedAt ? formatDateForCSV(job.publishedAt) : '',
      job.type || '',
      job.salary || '',
      job.url || ''
    ].map(field => `"${String(field).replace(/"/g, '""')}"`);
    
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
}

/**
 * Converte array de vagas para formato JSON
 */
export function jobsToJSON(jobs) {
  return JSON.stringify(jobs.map(job => ({
    cargo: job.role || '',
    titulo: job.title || '',
    empresa: job.company || '',
    local: job.location || '',
    publicadoEm: job.publishedAt || '',
    modalidade: job.type || '',
    salario: job.salary || '',
    link: job.url || '',
    descricao: job.snippet || ''
  })), null, 2);
}

/**
 * Formata data para CSV
 */
function formatDateForCSV(dateStr) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  } catch {
    return dateStr;
  }
}

/**
 * Salva conteúdo como arquivo
 */
export function saveFile(filename, content, mimeType = 'text/csv;charset=utf-8;') {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Erro ao salvar arquivo:', error);
    return false;
  }
}

/**
 * Gera nome de arquivo com timestamp
 */
export function generateFilename(prefix = 'vagas', extension = 'csv') {
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 10); // YYYY-MM-DD
  return `${prefix}-${timestamp}.${extension}`;
}

/**
 * Exporta vagas em formato CSV
 */
export function exportJobsAsCSV(jobs, filename) {
  const csv = jobsToCSV(jobs);
  const finalFilename = filename || generateFilename('vagas-br', 'csv');
  return saveFile(finalFilename, csv, 'text/csv;charset=utf-8;');
}

/**
 * Exporta vagas em formato JSON
 */
export function exportJobsAsJSON(jobs, filename) {
  const json = jobsToJSON(jobs);
  const finalFilename = filename || generateFilename('vagas-br', 'json');
  return saveFile(finalFilename, json, 'application/json;charset=utf-8;');
}

/**
 * Gera relatório de estatísticas das vagas
 */
export function generateJobReport(jobs) {
  if (!jobs || jobs.length === 0) {
    return {
      total: 0,
      byType: {},
      byLocation: {},
      byCompany: {},
      recentJobs: 0,
      withSalary: 0
    };
  }

  const report = {
    total: jobs.length,
    byType: {},
    byLocation: {},
    byCompany: {},
    recentJobs: 0,
    withSalary: 0
  };

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  jobs.forEach(job => {
    // Por tipo/modalidade
    if (job.type) {
      report.byType[job.type] = (report.byType[job.type] || 0) + 1;
    }

    // Por localização
    if (job.location) {
      report.byLocation[job.location] = (report.byLocation[job.location] || 0) + 1;
    }

    // Por empresa
    if (job.company) {
      report.byCompany[job.company] = (report.byCompany[job.company] || 0) + 1;
    }

    // Vagas recentes (última semana)
    if (job.publishedAt) {
      const jobDate = new Date(job.publishedAt);
      if (jobDate >= oneWeekAgo) {
        report.recentJobs++;
      }
    }

    // Vagas com salário
    if (job.salary) {
      report.withSalary++;
    }
  });

  return report;
}

/**
 * Exporta relatório de estatísticas
 */
export function exportJobReport(jobs, filename) {
  const report = generateJobReport(jobs);
  
  const reportText = `
RELATÓRIO DE VAGAS - ${new Date().toLocaleDateString('pt-BR')}
${'='.repeat(50)}

RESUMO GERAL:
- Total de vagas: ${report.total}
- Vagas recentes (7 dias): ${report.recentJobs}
- Vagas com salário informado: ${report.withSalary}

DISTRIBUIÇÃO POR MODALIDADE:
${Object.entries(report.byType)
  .sort(([,a], [,b]) => b - a)
  .map(([type, count]) => `- ${type}: ${count} vagas`)
  .join('\n')}

TOP 10 LOCALIZAÇÕES:
${Object.entries(report.byLocation)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .map(([location, count]) => `- ${location}: ${count} vagas`)
  .join('\n')}

TOP 10 EMPRESAS:
${Object.entries(report.byCompany)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .map(([company, count]) => `- ${company}: ${count} vagas`)
  .join('\n')}
`.trim();

  const finalFilename = filename || generateFilename('relatorio-vagas', 'txt');
  return saveFile(finalFilename, reportText, 'text/plain;charset=utf-8;');
}

