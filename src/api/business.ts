"use client";
import {
  BusinessCreationBody,
  ContactSupportDataSchema,
  type UpdateBusinessBody,
} from "@/types/business";
import { bizConnectAPI } from "@/config";
import $axios from "./axios";

export const allBusinessCategories = () => {
  const url = `${bizConnectAPI.baseURL}/api/business-profile/categories`;
  return $axios.get(url);
};

export const getAllBusinessCategories = () => {
  const url = `/business-profile/categories`;
  return $axios.get(url);
};

export const getUploadSignature = (folder: string) => {
  const url = `/business-profile/upload-signature`;
  return $axios.get(url, {
    params: {
      folderName: folder,
    },
  });
};

export const createBusinessProfile = (data: BusinessCreationBody) => {
  const url = `/business-profile/create`;
  return $axios.post(url, data);
};

export const getUserBusinessProfileList = () => {
  const url = `/business-profile/list`;
  return $axios.get(url);
};

export const searchForBusinesses = async (queryParams: string) => {
  const res = await $axios.get(`/businesses/search?${queryParams}`);
  return res.data;
};

export const getBusinessProfileById = (id: string) => {
  const url = `/business-profile/list/${id}`;
  return $axios.get(url);
};

export const getBusinsessCategories = () => {
  const url = `/business-profile/categories`;
  return $axios.get(url);
};

export const getUserBusinessProfileDetail = (id: string) => {
  const url = `/business-profile/list/${id}`;
  return $axios.get(url);
};

export const updateUserBusinessProfileDetail = (
  id: string,
  data: UpdateBusinessBody
) => {
  const url = `/business-profile/update/${id}`;
  return $axios.post(url, data);
};

export const deleteUserBusinessProfile = (profileId: string) => {
  const url = `/business-profile/delete/${profileId}`;
  return $axios.delete(url);
};

export const submitContactRequest = (data: ContactSupportDataSchema) => {
  const url = `/business-profile/contact/`;
  return $axios.post(url, data);
};
