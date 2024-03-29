import { axiosInstance } from "../config";

import {
  ALL_ZONE_FAIL,
  ALL_ZONE_REQUEST,
  ALL_ZONE_SUCCESS,
  ADMIN_ZONE_REQUEST,
  ADMIN_ZONE_SUCCESS,
  ADMIN_ZONE_FAIL,
  NEW_ZONE_REQUEST,
  NEW_ZONE_SUCCESS,
  NEW_ZONE_FAIL,
  UPDATE_ZONE_REQUEST,
  UPDATE_ZONE_SUCCESS,
  UPDATE_ZONE_FAIL,
  DELETE_ZONE_REQUEST,
  DELETE_ZONE_SUCCESS,
  DELETE_ZONE_FAIL,
  ZONE_DETAILS_REQUEST,
  ZONE_DETAILS_FAIL,
  ZONE_DETAILS_SUCCESS,
  CLEAR_ERRORS,
} from "../constants/zoneConstants";

// Get All Zones
export const getZones = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_ZONE_REQUEST });

    let link = `/api/v1/zones`;

    const { data } = await axiosInstance.get(link);

    dispatch({
      type: ALL_ZONE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_ZONE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get All Zones For Admin
export const getAdminZones = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_ZONE_REQUEST });

    const { data } = await axiosInstance.get("/api/v1/zones");

    dispatch({
      type: ADMIN_ZONE_SUCCESS,
      payload: data.zones,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_ZONE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Create Zone
export const createZone =
  (name, drugs, products, devices, firstZoneId) => async (dispatch) => {
    try {
      dispatch({ type: NEW_ZONE_REQUEST });

      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const { data } = await axiosInstance.post(
        `/api/v1/admin/zone/new`,
        { name },
        config
      );

      const zoneId = data.zone._id;

      // Drugs
      const { data: drugPricesData } = await axiosInstance.get(
        `/api/v1/drugPriceByZone/${firstZoneId}`
      );
      var drugPricedata = drugPricesData.drugPrice[0];
      delete drugPricedata["_id"];
      delete drugPricedata["createdAt"];
      drugPricedata = { ...drugPricedata, zoneId };

      for (var i = 0; i < drugs.length; i++) {
        var drugId = drugs[i]._id;
        drugPricedata = { ...drugPricedata, drugId };

        const { drugPrice } = await axiosInstance.post(
          `/api/v1/drugPrice/new`,
          drugPricedata,
          config
        );
      }

      // Products
      const { data: productPricesData } = await axiosInstance.get(
        `/api/v1/productPriceByZone/${firstZoneId}`
      );
      var productPricedata = productPricesData.productPrice[0];
      delete productPricedata["_id"];
      delete productPricedata["createdAt"];
      productPricedata = { ...productPricedata, zoneId };

      for (var i = 0; i < products.length; i++) {
        var productId = products[i]._id;
        productPricedata = { ...productPricedata, productId };

        const { productPrice } = await axiosInstance.post(
          `/api/v1/productPrice/new`,
          productPricedata,
          config
        );
      }

      // Devices
      const { data: devicePricesData } = await axiosInstance.get(
        `/api/v1/devicePriceByZone/${firstZoneId}`
      );
      var devicePricedata = devicePricesData.devicePrice[0];
      delete devicePricedata["_id"];
      delete devicePricedata["createdAt"];
      devicePricedata = { ...devicePricedata, zoneId };

      for (var i = 0; i < devices.length; i++) {
        var deviceId = devices[i]._id;
        devicePricedata = { ...devicePricedata, deviceId };

        const { devicePrice } = await axiosInstance.post(
          `/api/v1/devicePrice/new`,
          devicePricedata,
          config
        );
      }

      dispatch({
        type: NEW_ZONE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: NEW_ZONE_FAIL,
        payload: error.response.data.message,
      });
    }
  };

// Update Zone
export const updateZone = (id, zoneData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ZONE_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axiosInstance.put(
      `/api/v1/zone/${id}`,
      zoneData,
      config
    );

    dispatch({
      type: UPDATE_ZONE_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_ZONE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete Zone
export const deleteZone = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ZONE_REQUEST });

    const { data } = await axiosInstance.delete(`/api/v1/zone/${id}`);

    dispatch({
      type: DELETE_ZONE_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_ZONE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get Zones Details
export const getZoneDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: ZONE_DETAILS_REQUEST });

    const { data } = await axiosInstance.get(`/api/v1/zone/${id}`);

    dispatch({
      type: ZONE_DETAILS_SUCCESS,
      payload: data.zone,
    });
  } catch (error) {
    dispatch({
      type: ZONE_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
