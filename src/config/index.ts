import env from "./env";

export const bizConnectAPI = {
  baseURL: env.baseURL,
};

export const CloudinaryConfig = {
  apiKey: env.apiKey!,
  cloudName: env.cloudName,
};

export const prevPageLocalKeyName = "bizconnect_prev_page";
export const prevPageSearchKeyName = "bizconnect_prev_page_search";
export const prevLocationSearchKeyName = "bizconnect_prev_location_search";
export const DEFAULT_COUNTRY = "Canada";
export const DEFAULT_BIZ_IMAGE = {
  image:
    "https://res.cloudinary.com/drwt2qqf9/image/upload/c_fill,h_500,w_500,q_auto/v1721488956/default-img_vhxk4d.jpg",
};
