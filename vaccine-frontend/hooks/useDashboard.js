import { useState, useEffect, useCallback, useRef } from 'react';
import { dashboardService } from '../services/dashboardService';

export const useDashboard = () => {
    const [data, setData] = useState({ 
        metrics: { waiting_exam: 0, waiting_inject: 0, monitoring: 0, completed: 0 }, 
        patients: [],
        pagination: { total: 0, page: 1, limit: 10, total_pages: 0 }
    });

    const [loading, setLoading] = useState(false);

    // ✅ GỘP STATE
    const [query, setQuery] = useState({
        page: 1,
        search: ''
    });

    const [inputSearch, setInputSearch] = useState('');

    const abortRef = useRef(null);

    const fetchDashboardData = useCallback(async () => {
        try {
            if (abortRef.current) abortRef.current.abort();

            const controller = new AbortController();
            abortRef.current = controller;

            setLoading(true);

            const result = await dashboardService.getDailyOverview(
                controller.signal,
                {
                    page: query.page,
                    search: query.search,
                    limit: 10
                }
            );

            setData(result);

        } catch (err) {
            if (err.name !== "AbortError") {
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    }, [query]);

    useEffect(() => {
        fetchDashboardData();

        return () => {
            if (abortRef.current) abortRef.current.abort();
        };
    }, [fetchDashboardData]);

    // 🔍 SEARCH (Enter)
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            setQuery({
                page: 1,
                search: inputSearch.trim()
            });
        }
    };

    // 📄 PAGINATION
    const handlePageChange = (newPage) => {
        setQuery(prev => ({
            ...prev,
            page: newPage
        }));
    };

    // 🔄 REFRESH
    const handleRefresh = () => {
        setInputSearch('');
        setQuery({
            page: 1,
            search: ''
        });
    };

    return { 
        ...data,
        loading,
        search: inputSearch,
        setSearch: setInputSearch,
        page: query.page,
        setPage: handlePageChange,
        handleKeyDown,
        handleRefresh
    };
};