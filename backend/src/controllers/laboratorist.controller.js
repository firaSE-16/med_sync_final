import LabRequest from '../models/lab.model.js';


export const fillLabResultsForm = async (req, res) => {
  const { id } = req.params;
  const { results, status, notes } = req.body;

  // Check if the required fields are present
  if (!results || !status) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    // Find the lab request by patient ID or labRequest ID
    const labRequest = await LabRequest.findOne({ patientId: id }); // Use `id` from params
console.log(id);
    // If lab request is not found
    if (!labRequest) {
      return res.status(404).json({ error: 'Lab request not found.' });
    }

   
    labRequest.results = results;
    labRequest.status = status;
    labRequest.notes = notes || ''; 

    
    await labRequest.save();

    res.status(200).json({ message: 'Lab results form filled successfully.', labRequest });
  } catch (error) {
    console.error("Error while updating lab request:", error);
    res.status(500).json({ error: error.message });
  }
};

// Fetch all patients associated with lab requests
export const getAllPatientsWithLabRequests = async (req, res) => {
  try {
    // Find all lab requests and populate patient information
    const labRequests = await LabRequest.find()
      .populate('patientId', 'fullName email') // Populate the patientId field with patient details
      .exec();

    // Check if no lab requests are found
    if (labRequests.length === 0) {
      return res.status(404).json({ error: 'No lab requests found.' });
    }

    // Create an array of unique patients based on the lab requests
    const uniquePatients = [];
    labRequests.forEach(labRequest => {
      if (!uniquePatients.find(patient => patient._id.toString() === labRequest.patientId._id.toString())) {
        uniquePatients.push(labRequest.patientId);
      }
    });

    // Return the unique list of patients with lab requests
    res.status(200).json({ patients: uniquePatients });
  } catch (error) {
    console.error("Error fetching patients with lab requests:", error);
    res.status(500).json({ error: error.message });
  }
};
