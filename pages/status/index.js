import useSWR from "swr";


async function fetchAPI(key) {
  const response = await fetch(key);
  const data = await response.json();
  return data;
}

function StatusPage() {

  return (
    <>
      <h1>Status</h1>
      <UpdatedAt/>
    </>
  )
}

function UpdatedAt() {

  const {isLoading, data} = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000
  });

  let updatedAtText = (!isLoading && data) ? new Date(data.updated_at).toLocaleString("pt-BR") : "Carregando..."

  return <div>Última atualização: {updatedAtText}</div>
}



export default StatusPage