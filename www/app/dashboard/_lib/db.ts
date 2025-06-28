import { SupplyLine } from "../../_interfaces";

export async function fetchFranchises() {
  const res = await fetch("http://127.0.0.1:8000/franchise");
  if (!res.ok) {
    throw new Error("Error al obtener las franquicias");
  }
  return  await res.json();
}

export async function fetchFranchiseRIF(rif) {
  const res = await fetch(`http://127.0.0.1:8000/franchise/search?${rif}`)
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

export const fetchSupplyLines = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/supplier_line');
    if (!response.ok) {
      throw new Error('Error al obtener las lineas de suministro');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener las lineas de suministro:', error);
    return [];
  }
};

export const fetchVendors = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/vendor');
    if (!response.ok) {
      throw new Error('Error al obtener los proveedores');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener los proveedores:', error);
    return [];
  }
};