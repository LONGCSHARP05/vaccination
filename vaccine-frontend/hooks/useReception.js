

import { useState, useEffect, useCallback, useRef } from 'react';
import patientService from '../services/reception/patientService';
import registeredService from '../services/reception/registeredService';
import appointmentService from '../services/reception/appointmentService';

export const useReception = (activeTab) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', date: '' });
  const abortRef = useRef(null);

  const loadData = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      let res;
      const params = { page, limit: 10, search };

      if (activeTab === 'list') {
        res = await patientService.fetchList(params, controller.signal);
      } else if (activeTab === 'registered') {
        res = await registeredService.fetchList({ ...params, status: filters.status }, controller.signal);
      } else if (activeTab === 'appointments') {
        res = await appointmentService.fetchList({ ...params, date: filters.date }, controller.signal);
      }

      if (res) {
        setData(res.data || []);
        setTotal(res.total || 0);
      }
    } catch (err) {
      if (err.name !== 'CanceledError') setData([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, search, filters]);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { setPage(1); }, [activeTab, search]);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') setSearch(e.target.value.trim());
  };

  
  return { data, loading, page, setPage, total, search, setSearch, handleSearchKeyDown, filters, setFilters };
};