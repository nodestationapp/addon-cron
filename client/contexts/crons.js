import { createContext, useContext, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { api } from "@nstation/design-system/utils";
import { useSearchParams } from "react-router-dom";
import queryString from "query-string";
const CronsContext = createContext();

const CronsProvider = ({ children }) => {
  const [archive_modal, setArchiveModal] = useState(null);

  const [searchParams] = useSearchParams();

  const page = searchParams.get("page");
  const sort = searchParams.get("sort");

  const {
    isLoading: loading,
    data: crons,
    refetch: refetchCrons,
  } = useQuery({
    queryKey: ["crons", page, sort],
    queryFn: () =>
      api.get(
        `/admin-api/crons?${queryString.stringify({
          page: page || 0,
          pageSize: 20,
          sort,
        })}`
      ),
  });

  const addCron = (values) =>
    new Promise(async (resolve, reject) => {
      try {
        await api.post(`/admin-api/crons`, values);

        refetchCrons();

        resolve();
      } catch (err) {
        reject(err);
      }
    });

  const deleteCron = (id) =>
    new Promise(async (resolve, reject) => {
      try {
        await api.delete(`/admin-api/crons/${id}`);

        refetchCrons();

        resolve();
      } catch (err) {
        reject(err);
      }
    });

  const value = useMemo(() => {
    return {
      crons,
      loading,
      archive_modal,
      setArchiveModal,
      refetchCrons,
      addCron,
      deleteCron,
      sort,
    };
    // eslint-disable-next-line
  }, [crons, loading, archive_modal, sort]);

  return (
    <CronsContext.Provider value={value}>{children}</CronsContext.Provider>
  );
};

const useCrons = () => useContext(CronsContext);
export { CronsContext, useCrons };
export default CronsProvider;
