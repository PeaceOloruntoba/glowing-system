import * as clientService from "../../services/designer/client.service.js";

// Create a new client
export const createClient = async (req, res) => {
  try {
    const { clientName, measurements } = req.body;
    const designerId = req.user.userId; // Get logged-in designer's ID

    if (
      !clientName ||
      !measurements ||
      !Array.isArray(measurements) ||
      measurements.length === 0
    ) {
      return res.status(400).json({
        message: "Client name and at least one measurement are required.",
      });
    }

    const newClient = await clientService.createClient({
      ...req.body,
      designerId,
    });

    return res
      .status(201)
      .json({ message: "Client created successfully.", data: newClient });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating client." });
  }
};

// Update an existing client
export const updateClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const designerId = req.user.userId; // Get logged-in designer's ID
    const updates = req.body;

    const updatedClient = await clientService.updateClient(
      clientId,
      updates,
      designerId
    );

    return res
      .status(200)
      .json({ message: "Client updated successfully.", data: updatedClient });
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Error updating client." });
  }
};

// Get all clients for the logged-in designer
export const getAllClients = async (req, res) => {
  try {
    const designerId = req.user.userId;
    const clients = await clientService.getAllClients(designerId);

    return res
      .status(200)
      .json({ message: "Clients retrieved successfully.", data: clients });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving clients." });
  }
};

// Get a single client by ID for the logged-in designer
export const getClientById = async (req, res) => {
  try {
    const { clientId } = req.params;
    const designerId = req.user.userId;
    const client = await clientService.getClientById(clientId, designerId);

    return res
      .status(200)
      .json({ message: "Client retrieved successfully.", data: client });
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Error retrieving client." });
  }
};

// Delete a client
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const designerId = req.user.userId; // Get logged-in designer's ID
    await clientService.deleteClient(id, designerId);
    return res.status(200).json({ message: "Client deleted successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Error deleting client." });
  }
};
