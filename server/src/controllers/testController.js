const axios = require("axios");

const generateBulkLeads = async (req, res) => {
    try {

        const requests = [];

        for (let i = 1; i <= 10; i++) {

            const uniquePhone =
                Math.floor(
                    1000000000 + Math.random() * 9000000000
                ).toString();

            requests.push(

                axios.post(
                    "http://localhost:5000/api/leads/create",
                    {
                        name: `Test User ${i}`,

                        phone: uniquePhone,

                        city: "Ranchi",

                        serviceType: "Service 3",

                        description: "Bulk generated lead",
                    }
                )
            );
        }

        await Promise.all(requests);

        res.status(200).json({
            success: true,
            message:
                "10 concurrent leads generated successfully",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message:
                error.response?.data?.message ||
                error.message,
        });
    }
};

module.exports = {
    generateBulkLeads,
};