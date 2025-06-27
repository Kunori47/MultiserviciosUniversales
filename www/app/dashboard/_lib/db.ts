export async function fetchFranchises() {
  const res = await fetch("http://127.0.0.1:8000/franchise");
  if (!res.ok) {
    throw new Error("Error al obtener las franquicias");
  }
  return  await res.json();
}

export async function fetchEmployeeName(CI) {
  const res = await fetch(`http://127.0.0.1:8000/employee/${CI}`);
    if (!res.ok) {
    throw new Error("Error al obtener las franquicias");
  }
  return  await res.json();

}

export async function fetchEmployeeNameByFranchise(RIF) {
  const res = await fetch(`http://127.0.0.1:8000/employee/franchise/${RIF}`)
  if (!res.ok) {
    throw new Error("Error al obtener las franquicias");
  }
  return  await res.json();
}
