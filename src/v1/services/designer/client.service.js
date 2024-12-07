import Client from "../../models/client.model.js";
import ApiError from "../../../utils/apiError.js";

// Create a new client
export const createClient = async (data) => {
  try {
    const client = new Client(data);
    return await client.save();
  } catch (error) {
    throw ApiError.internalServerError("Error creating client.");
  }
};

// Update an existing client
export const updateClient = async (id, updates, designerId) => {
  const client = await Client.findById(id);
  if (!client) {
    throw ApiError.notFound("Client not found.");
  }
  if (client.designerId.toString() !== designerId.toString()) {
    throw ApiError.unauthorized(
      "You are not authorized to update this client."
    );
  }
  Object.assign(client, updates);
  const updateCl = await client.save();
  return updateCl;
};

// Get all clients for a specific designer
export const getAllClients = async (designerId) => {
  try {
    return await Client.find({ designerId }).populate(
      "designerId",
      "name email"
    );
  } catch (error) {
    throw ApiError.internalServerError("Error retrieving clients.");
  }
};

// Get a single client by ID for a specific designer
export const getClientById = async (id, designerId) => {
  const client = await Client.findOne({ _id: id, designerId }).populate(
    "designerId",
    "name email"
  );
  if (!client) {
    throw ApiError.notFound("Client not found or unauthorized access.");
  }

  return client;
};

// Delete a client
export const deleteClient = async (id, designerId) => {
  // Step 1: Check if the client exists
  const client = await Client.findById(id);
  if (!client) {
    throw ApiError.notFound("Client not found.");
  }
  if (client.designerId.toString() !== designerId.toString()) {
    throw ApiError.unauthorized(
      "You are not authorized to delete this client."
    );
  }
  const deleteCl = await client.remove();
  return deleteCl;
};
