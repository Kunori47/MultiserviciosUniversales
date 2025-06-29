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

export const fetchMaintenancePlans = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/maintenanceplan');
    if (!response.ok) {
      throw new Error('Error al obtener los planes de mantenimiento');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener los planes de mantenimiento:', error);
    return [];
  }
};

export const fetchBrands = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/brand');
    if (!response.ok) {
      throw new Error('Error al obtener las marcas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener las marcas:', error);
    return [];
  }
};

export const fetchModels = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/model');
    if (!response.ok) {
      throw new Error('Error al obtener los modelos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener los modelos:', error);
    return [];
  }
};

export const fetchSpecialties = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/specialty');
    if (!response.ok) {
      throw new Error('Error al obtener las especialidades');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener las especialidades:', error);
    return [];
  }
};

export const fetchServices = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/service');
    if (!response.ok) {
      throw new Error('Error al obtener los servicios');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener los servicios:', error);
    return [];
  }
};