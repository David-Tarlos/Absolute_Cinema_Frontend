import axiosClient from './axiosClient';
import { PageResponseDTO } from '@/types/pageDTO';

export interface ProductionCompanyDto {
    id?: number;
    name: string;
    logoPath?: string;
    originCountry?: string;
    movieIds?: number[];
}

// Paginated fetch
export const getAllProductionCompanies = async (
    page: number = 0,
    size: number = 20
): Promise<PageResponseDTO<ProductionCompanyDto>> => {
    const response = await axiosClient.get(`/production-companies?page=${page}&size=${size}`);
    return response.data;
};

export const getProductionCompanyById = async (id: number): Promise<ProductionCompanyDto> => {
    const response = await axiosClient.get(`/production-companies/${id}`);
    return response.data;
};

export const createProductionCompany = async (company: ProductionCompanyDto): Promise<ProductionCompanyDto> => {
    const response = await axiosClient.post(`/production-companies`, company);
    return response.data;
};

export const updateProductionCompany = async (id: number, company: ProductionCompanyDto): Promise<ProductionCompanyDto> => {
    const response = await axiosClient.put(`/production-companies/${id}`, company);
    return response.data;
};

export const deleteProductionCompany = async (id: number): Promise<void> => {
    await axiosClient.delete(`/production-companies/${id}`);
};
