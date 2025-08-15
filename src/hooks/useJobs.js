import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchJobs } from '../api/jobService.js';

/**
 * Hook customizado para gerenciar busca e estado das vagas
 */
export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Ref para evitar múltiplas requisições simultâneas
  const loadingRef = useRef(false);
  
  // Parâmetros da última busca para evitar requisições desnecessárias
  const lastSearchRef = useRef(null);

  /**
   * Busca vagas com os parâmetros especificados
   */
  const searchJobs = useCallback(async (searchParams, reset = false) => {
    // Evita múltiplas requisições simultâneas
    if (loadingRef.current) return;
    
    const { keywords, location, mode } = searchParams;
    const searchKey = `${keywords}-${location}-${mode}`;
    const targetPage = reset ? 1 : page;
    
    // Se é a mesma busca e não é reset, não faz nova requisição
    if (!reset && lastSearchRef.current === searchKey && jobs.length > 0) {
      return;
    }
    
    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);
      
      // Constrói keywords com modalidade se especificada
      const finalKeywords = mode ? `${keywords} ${mode}` : keywords;
      
      const result = await fetchJobs({
        keywords: finalKeywords,
        location: location || "Brasil",
        page: targetPage,
        pageSize: 20
      });
      
      // Adiciona informações extras aos jobs
      const enrichedJobs = result.jobs.map(job => ({
        ...job,
        role: keywords,
        id: `${job.company}-${job.title}-${job.publishedAt}`.replace(/\s+/g, '-').toLowerCase()
      }));
      
      if (reset) {
        setJobs(enrichedJobs);
        setPage(1);
      } else {
        setJobs(prev => [...prev, ...enrichedJobs]);
      }
      
      setTotalCount(result.totalCount);
      setHasMore(result.hasMore && enrichedJobs.length > 0);
      setPage(targetPage);
      
      lastSearchRef.current = searchKey;
      
    } catch (err) {
      console.error('Erro ao buscar vagas:', err);
      setError(err.message || 'Erro ao buscar vagas');
      setHasMore(false);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [page, jobs.length]);

  /**
   * Carrega mais vagas (próxima página)
   */
  const loadMore = useCallback(async (searchParams) => {
    if (!hasMore || loading) return;
    
    await searchJobs(searchParams, false);
    setPage(prev => prev + 1);
  }, [hasMore, loading, searchJobs]);

  /**
   * Reseta o estado e faz nova busca
   */
  const resetAndSearch = useCallback(async (searchParams) => {
    setJobs([]);
    setPage(1);
    setHasMore(true);
    setTotalCount(0);
    lastSearchRef.current = null;
    
    await searchJobs(searchParams, true);
  }, [searchJobs]);

  /**
   * Limpa todos os dados
   */
  const clearJobs = useCallback(() => {
    setJobs([]);
    setPage(1);
    setHasMore(true);
    setTotalCount(0);
    setError(null);
    lastSearchRef.current = null;
  }, []);

  return {
    jobs,
    loading,
    error,
    hasMore,
    page,
    totalCount,
    searchJobs: resetAndSearch,
    loadMore,
    clearJobs
  };
}

/**
 * Hook para gerenciar favoritos
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('job-favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = useCallback((job) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.id === job.id || fav.url === job.url);
      let newFavorites;
      
      if (exists) {
        newFavorites = prev.filter(fav => fav.id !== job.id && fav.url !== job.url);
      } else {
        newFavorites = [...prev, { ...job, favoritedAt: new Date().toISOString() }];
      }
      
      try {
        localStorage.setItem('job-favorites', JSON.stringify(newFavorites));
      } catch (error) {
        console.error('Erro ao salvar favoritos:', error);
      }
      
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((job) => {
    return favorites.some(fav => fav.id === job.id || fav.url === job.url);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    try {
      localStorage.removeItem('job-favorites');
    } catch (error) {
      console.error('Erro ao limpar favoritos:', error);
    }
  }, []);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites
  };
}

/**
 * Hook para scroll infinito
 */
export function useInfiniteScroll(callback, hasMore, loading) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          callback();
        }
      },
      {
        rootMargin: '400px', // Carrega quando está 400px antes de aparecer
        threshold: 0.1
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [callback, hasMore, loading]);

  return sentinelRef;
}

