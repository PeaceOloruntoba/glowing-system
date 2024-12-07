import Client from "../../models/client.model.js";
import ApiError from "../../../utils/apiError.js";

// Create a new client
export const createClient = async (data) => {
  const client = new Client(data);
  return await client.save();
};

// Update an existing client
export const updateClient = async (clientId, updates, designerId) => {
  // Find and update the client, ensuring designerId matches
  const client = await Client.findOneAndUpdate(
    { _id: clientId, designerId },
    updates,
    { new: true }
  );
  if (!client) {
    throw ApiError.notFound("Client not found or unauthorized access");
  }
  return client;
};

// Get all clients for a specific designer
export const getAllClients = async (designerId) => {
  return await Client.find({ designerId }).populate("designerId", "name email");
};

// Get a single client by ID for a specific designer
export const getClientById = async (clientId, designerId) => {
  const client = await Client.findOne({ _id: clientId, designerId }).populate(
    "designerId",
    "name email"
  );
  if (!client) {
    throw ApiError.notFound("Client not found or unauthorized access");
  }
  return client;
};

// Delete a client
export const deleteClient = async (clientId, designerId) => {
  const client = await Client.findOneAndDelete({ _id: clientId, designerId });
  if (!client) {
    throw ApiError.notFound("Client not found or unauthorized access");
  }
  return client;
};
