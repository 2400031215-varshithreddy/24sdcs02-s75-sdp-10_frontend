import axiosInstance from './axiosInstance';
import axios from 'axios';

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  try {
    const res = await axiosInstance.post<T>(path, body);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const errorMsg = err.response.data?.message || err.response.data?.error || "Request failed";
      throw new Error(errorMsg);
    }
    throw err;
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  try {
    const res = await axiosInstance.get<T>(path);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const errorMsg = err.response.data?.message || err.response.data?.error || "Request failed";
      throw new Error(errorMsg);
    }
    throw err;
  }
}
export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  try {
    const res = await axiosInstance.put<T>(path, body);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const errorMsg = err.response.data?.message || err.response.data?.error || "Request failed";
      throw new Error(errorMsg);
    }
    throw err;
  }
}

export async function apiDelete<T>(path: string): Promise<T> {
  try {
    const res = await axiosInstance.delete<T>(path);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const errorMsg = err.response.data?.message || err.response.data?.error || "Request failed";
      throw new Error(errorMsg);
    }
    throw err;
  }
}
